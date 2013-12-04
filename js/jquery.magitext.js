/*jslint browser: true, todo: true, indent: 2 */
/*global jQuery */
/**
 * Disclaimer: I am so so sorry for the name.
 */
(function (document, $) {
  "use strict";

  var
    currentActiveInput,
    idSequence = 1,
    autoSizeEnabled = "function" === typeof $.fn.autosize;

  /**
   * Provide String.trim() for older browsers
   */
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  /**
   * Get selected text within the given element boundaries
   *
   * This code belong to its author and was found on Stack Overflow.
   * Huge thanks to him; See http://stackoverflow.com/a/5801903/552405
   *
   * @param DOMElement element
   *
   * @return String
   */
  function getSelectedTextWithin(el) {
    var selectedText = "";
    if (typeof window.getSelection !== "undefined") {
      var sel = window.getSelection(), rangeCount;
      if ( (rangeCount = sel.rangeCount) > 0 ) {
        var range = document.createRange();
        for (var i = 0, selRange; i < rangeCount; ++i) {
          range.selectNodeContents(el);
          selRange = sel.getRangeAt(i);
          if (selRange.compareBoundaryPoints(range.START_TO_END, range) == 1 && selRange.compareBoundaryPoints(range.END_TO_START, range) == -1) {
            if (selRange.compareBoundaryPoints(range.START_TO_START, range) == 1) {
              range.setStart(selRange.startContainer, selRange.startOffset);
            }
            if (selRange.compareBoundaryPoints(range.END_TO_END, range) == -1) {
              range.setEnd(selRange.endContainer, selRange.endOffset);
            }
            selectedText += range.toString();
          }
        }
      }
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
      var selTextRange = document.selection.createRange();
      var textRange = selTextRange.duplicate();
      textRange.moveToElementText(el);
      if (selTextRange.compareEndPoints("EndToStart", textRange) == 1 && selTextRange.compareEndPoints("StartToEnd", textRange) == -1) {
        if (selTextRange.compareEndPoints("StartToStart", textRange) == 1) {
          textRange.setEndPoint("StartToStart", selTextRange);
        }
        if (selTextRange.compareEndPoints("EndToEnd", textRange) == -1) {
          textRange.setEndPoint("EndToEnd", selTextRange);
        }
        selectedText = textRange.text;
      }
    }
    return selectedText;
  }

  $.fn.magicTextarea = function (options) {
    var defaultClass;

    options = options || {};

    defaultClass = options.defaultClass || "default";

    this.each(function () {
      if ("textarea" === this.type) {

        var
          $this = $(this),
          self = this;

        // Initialize the jQuery.autosize() plugin if present
        if (autoSizeEnabled) {
          $this.autosize();
        }

        if (!this.id) {
          this.id = "input-" + (idSequence++);
        }

        $this.on("focus", function () {
          currentActiveInput = self;
        });

        if (options.activate || $this.is("." + defaultClass)) {
          currentActiveInput = self;
        }
      }
    });
  };

  $.fn.magicQuoteButton = function () {
    this.on("click", function (ev) {

      var
        element,
        lines,
        clean = [],
        content,
        k = 0,
        p = false,
        title = "",
        target = currentActiveInput;

      ev.preventDefault();
      ev.stopPropagation();

      if (target && this.attributes.rel) {
        element = document.getElementById(this.attributes.rel.value);
        if (element) {

          content = getSelectedTextWithin(element).trim();
          if (!content) {
            content = element.textContent.trim();
          }

          // Proceed to input cleanup (remove empty lines and trim others)
          lines = content.split("\n");
          for (k in lines) {
            if (/^\s*$/.test(lines[k])) {
              if (p) {
                continue; // Skip empty lines only when previous is not
              }
              p = true;
            } else {
              p = false;
            }
            clean.push("> " + lines[k].trim());
          }

          // Compute title
          if (element.attributes.title && "" !== element.attributes.title.value) {
            title = "**" + element.attributes.title.value  + " :**\n";
          }

          // Append all the things!
          if ("" === target.value) {
            target.value = title + clean.join("\n") + "\n\n";
          } else {
            target.value = target.value + "\n\n" + title + clean.join("\n") + "\n\n";
          }

          // Expand textarea and focus it, also move the viewport to it
          $(target).trigger('autosize.resize');
          if (target.id) {
            window.location.hash = target.id;
          }
          target.focus();
        }
      }
    });
  };

  Drupal.behaviors.magiText = {
    attach: function (context) {
      $("textarea.magitext", context).once('magitext').magicTextarea();
      $(".magiquote", context).once('magitext').magicQuoteButton();
    }
  };

}(document, jQuery));
