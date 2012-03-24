/*
 * Cadence.js
 *
 * A typing style monitro for input fields
 *
 * Author: Ryan McGowan
 */

(function (context) {
    var Cadence = function (element, endEvent, callback, engine) {
      var cleanData = {'content': '', 'cadence': {}};
      var cadence = {'data': cleanData};
      var engines = {};

      // Create default engines for doing the acutal monitoring
      engines.jquery = function () {
        var $ = jquery;
        this.listen = function () {
          console.log(this);
          var el = $(this._element);
        };
      };


      cadence.setCallback = function (cb) {
        this.engine._callback = cb;
      };

      cadence.setElement = function (el, listen) {
        this.engine._element = el;
        if (arguments.length < 2 || listen === true) {
          this.startListening();
        }
      };

      cadence.setEndEvent = function (event) {
        this.engine._endEvent = event;
      };

      cadence.setEngine = function (eng) {
        if (typeof eng === "string") {
          try {
            cadence.engine = engines[eng];
          } catch (err) {
            throw Exception("Unsupported engine [\"" + eng + "\"] " +
                "specified.");
          }
        } else {
          cadence.engine = eng;
        }
      };

      // Set internal values based on arguments
      if (arguments.length >= 1) {
        cadence.setElement(element);
      }
      if (arguments.length >= 2) {
        cadence.setCallback(callback);
      }
      if (arguments.length < 3) {
        cadence.engine = engines.jQuery();
      } else {
        cadence.setEngine(engine);
      }

      cadence.startListening = function () {
        this.engine.listen(this._element);
      };

      return cadence;
    };

    context.Cadence = Cadence;
})(this);
