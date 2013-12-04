/*jslint browser: true, todo: true, indent: 2 */
/*global jQuery */
/**
 * Brings a few missing functions that were added into jQuery 1.7 to previous
 * versions; Those functions are actually the most used ones and are sufficient
 * to ensure that a lot of jQuery plugins actually work fine on jQuery 1.4.
 *
 * This is an alternative to the jQuery Update Drupal module.
 *
 * This has been tested and approved using:
 *  - jQuery.autosize
 *  - jQuery.Gantt
 *
 * Have fun!
 */
(function ($) {
  "use strict";

  var
    k = 0,
    missing = {},
    returnFalse = function () {
      return false;
    };

  if (!$.isNumeric) {
    $.extend({
      isNumeric: function (value) {
        return "number" === typeof parseInt(value, 10);
      }
    });
  }

  missing = {
    on: function (types, selector, data, fn) {
      var type;
      // Decal parameters if selector is not a string
      // Algorithm from jQuery 1.7
      if (data == null && fn == null) {
        // (types, fn)
        fn = selector;
        data = selector = undefined;
      } else if (fn == null) {
        if ("string" === typeof selector) {
          // (types, selector, fn)
          fn = data;
          data = undefined;
        } else {
          // (types, data, fn)
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if (fn === false) {
        fn = returnFalse;
      } else if (!fn) {
        return this;
      }
      // Ensure types is an iterable
      if ("string" !== typeof types) {
        for (type in types) {
          this.on(type, selector, data, fn);
        }
        return this;
      } else {
        return this.each(function () {
          if (selector) {
            if (data) {
              $(this).find(selector).bind(types, data, fn);
            } else {
              $(this).find(selector).bind(types, fn);
            }
          } else {
            if (data) {
              $(this).bind(types, data, fn);
            } else {
              $(this).bind(types, fn);
            }
          }
        });
      }
    }
  };

  for (k in missing) {
    if (missing.hasOwnProperty(k)) {
      if ($.fn[k]) {
        delete missing[k];
      }
    }
  }

  $.fn.extend(missing);

}(jQuery));