/*
 * Cadence.js
 *
 * A typing style monitro for input fields
 *
 * Author: Ryan McGowan
 */

(function ($) {
    $.fn.cadence = function (finishedCallback, userOptions) {
      var options = {
        userPhraseSel: ".phrase",
        givenPhraseSel: "#training-phrase",
        givenPhrase: null,
        alertCallback: alert
      };
      $.extend(options, userOptions);
      var resetData = {string: '', timeline: []};
      var cadence = {data: resetData};

      cadence.reset = function () {
        this.data = resetData;
      };

      cadence.cleanUp = function () {
        this.data.string = this.data.timeline[
          this.data.timeline.length - 1].value;
        this.data.timeline.sort(function (a, b) {
          return a.time - b.time;
        });
        for (var i = 0, length = this.data.timeline.length; i < length; i++) {
          eve = this.data.timeline[i];
          if (i === 0) {
            eve.timeDifference = eve.time;
          } else {
            var last_eve = this.data.timeline[i - 1];
            eve.timeDifference = eve.time - last_eve.time;
          }
        }
      };

      var phraseEl = this.find(options.userPhraseSel);
      phraseEl.attr("autocomplete", "no");
      var givenPhrase = options.givenPhrase;
      if (givenPhrase === null) {
        givenPhrase = $(options.givenPhraseSel).text();
      }

      cadence.checkPhrase = function (phrase) {
        if (givenPhrase === phrase) {
          return 0;
        } else if (phrase === givenPhrase.substring(0, phrase.length)) {
          return 1;
        } else {
          return -1;
        }
      };

      var first = true;
      var timeStart;
      cadence.logKeyEvent = function (event) {
        if (first) {
          first = false;
          timeStart = event.timeStamp;
          lastTime = event.timeStamp;
        }
        cadence.data.timeline.push({
            which: event.which,
            type: event.type,
            value: event.target.value,
            time: (event.timeStamp - timeStart)
            //_event: event
        });

        var check = cadence.checkPhrase(givenPhrase, event.target.value);
        if (0 === check) {
          cadence.cleanUp();
          finishedCallback(cadence.data);
          cadence.reset();
        } else if(check < 0) {
          cadence.reset();
          options.alertCallback("You messed up!.");
          console.log("You messed up.");
          console.log(event.target.value);
        } else {
          console.log(event.target.value);
        }
      };

      // Set up event listeners
      phraseEl.keydown(cadence.logKeyEvent);
      phraseEl.keyup(cadence.logKeyEvent);

      // Prevent the default form submission.
      this.submit(function (event) {
        event.preventDefault();
      });

      return this;
    };
})(jQuery);
