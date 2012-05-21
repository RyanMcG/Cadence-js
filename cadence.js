/*
 * Cadence.js
 *
 * A typing style monitor for input fields
 *
 * Author: Ryan McGowan
 */

(function ($) {
    $.fn.cadence = function (finishedCallback, userOptions) {

      // First we define some helper functions.
      var toKeyCodes = function (instr) {
        var str = instr.toUpperCase();
        var codes = [];
        for (var i = 0, len = str.length; i < len; i++) {
          codes.push(str.charCodeAt(i));
        }
        return codes;
      };

      // Create default options
      var options = {
        userPhraseSel: ".phrase",
        givenPhraseSel: "#training-phrase",
        givenPhrase: null,
        debug: false,
        alertCallback: function (msg, debug) {
          if (debug) {
            console.log("CADENCE ERROR: " + msg);
          }
        }
      };
      // And merge them with what the user gives us.
      $.extend(options, userOptions);


      var cadence = {timeline: []};

      var givenPhrase = options.givenPhrase;
      if (givenPhrase === null) {
        givenPhrase = $(options.givenPhraseSel).text();
      }
      var givenPhraseCodes = toKeyCodes(givenPhrase);

      var position = 0;
      var endPosition = givenPhrase.length - 1;

      var phraseEl = this.find(options.userPhraseSel);

      phraseEl.attr("autocomplete", "off");

      cadence.cleanUp = function () {
        this.result = {timeline: []};
        this.timeline.sort(function (a, b) {
          return a.timeStamp - b.timeStamp;
        });
        var startTime;
        var lastTime;
        var completeStr = "";
        for (var i = 0, length = this.timeline.length; i < length; i++) {
          eve = this.timeline[i];
          if (i === 0) {
            startTime = eve.timeStamp;
            lastTime = eve.timeStamp;
          }
          completeStr += String.fromCharCode(eve.keyCode).toLowerCase();
          this.result.timeline.push({
              time: eve.timeStamp - startTime,
              timeDifference: eve.timeStamp - lastTime,
              keyCode: eve.keyCode,
              character: String.fromCharCode(eve.keyCode).toLowerCase()
          });
          lastTime = eve.timeStamp;
        }
        this.result.phrase = completeStr;
      };

      cadence.reset = function (alert) {
        position = 0;
        if (typeof alert !== 'undefined' && alert) {
          options.alertCallback("You are no longer typing in the " +
              "given phrase ('" + givenPhrase +"').", options.debug);
        }
        cadence.timeline = [];
        phraseEl.val("");
      };


      cadence.logKeyDown = function (event) {
        //console.log(givenPhraseCodes[position] + " " + event.which + " " + position);
        if (givenPhraseCodes[position] === event.keyCode) {
          cadence.timeline.push(event);
        } else {
          cadence.reset(true);
        }
        //position++;
      };

      cadence.logKeyUp = function (event) {
        //console.log(givenPhraseCodes[position] + " " + event.keyCode + " " + position);
        if (givenPhraseCodes[position] === event.keyCode) {
          cadence.timeline.push(event);
          if (position === endPosition) {
            cadence.cleanUp();
            finishedCallback($.extend({}, cadence.result));
            cadence.reset();
          }
          position++;
        } else {
          cadence.reset(true);
        }
      };

      // Set up event listeners
      //phraseEl.keydown(cadence.logKeyDown);
      phraseEl.keyup(cadence.logKeyUp);

      // Prevent the default form submission.
      this.submit(function (event) {
        event.preventDefault();
      });

      return this;
    };
})(jQuery);
