/*jslint browser: true, todo: true, indent: 2 */
/*global Drupal, jQuery */

/**
 * Disclaimer: I am so so sorry for the name.
 */
(function (document, $) {
  "use strict";

  var
    currentActiveInput,
    idSequence = 1,
    autoSizeEnabled = "function" === typeof $.fn.autosize,
    quoteButtons = [],
    replyButtons = [],
    InputList = [],
    Input,
    activate,
    focusTo,
    moveTo,
    findInput;

  /**
   * Build a textarea wrapper
   */
  Input = function Input (element) {
    var $target = $(element);
    this.target = element;
    this.$form = $(this.target).parents('form');
    if (!this.target.id) {
      this.target.id = "input-" + (idSequence++);
    }
    if (element.attributes["data-input"]) {
      this.inputId = element.attributes["data-input"].value;
    } else {
      this.inputId = this.target.id;
    }
    this.id = this.target.id;
    this.$backTo = $("<a class=\"back-to\" style=\"display: none;\" href=\"#\">Go back</a>");
    this.$backTo.on("click", function (ev) {
      $(this).hide();
    });
    $target.after(this.$backTo);
    $target.parent().addClass("back-to-wrapper");
  };

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
   * This code belong to its authors and was found on Stack Overflow.
   * Huge thanks to them; See:
   *   http://stackoverflow.com/a/5801903/552405
   * Modified this function in order to add sugar candy from:
   *   http://stackoverflow.com/a/4652824/552405
   * Which actually allows to keep some kind of formatting there!
   *
   * @param DOMElement element
   *
   * @return String
   */
  function getSelectedTextWithin(el, html) {

    var selectedText = '', container, sel, rangeCount, i = 0, selRange, selTextRange, textRange;

    if (undefined !== window.getSelection) {
      sel = window.getSelection();

      if (html) {
        container = document.createElement("div");
      } else {
        selectedText = "";
      }

      rangeCount = sel.rangeCount;
      if (rangeCount > 0) {
        var range = document.createRange();
        for (i = 0; i < rangeCount; ++i) {
          range.selectNodeContents(el);
          selRange = sel.getRangeAt(i);
          if (selRange.compareBoundaryPoints(range.START_TO_END, range) == 1 && selRange.compareBoundaryPoints(range.END_TO_START, range) == -1) {
            if (selRange.compareBoundaryPoints(range.START_TO_START, range) == 1) {
              range.setStart(selRange.startContainer, selRange.startOffset);
            }
            if (selRange.compareBoundaryPoints(range.END_TO_END, range) == -1) {
              range.setEnd(selRange.endContainer, selRange.endOffset);
            }

            if (html) {
              container.appendChild(range.cloneContents());
            } else {
              selectedText += range.toString();
            }
          }
        }
      }

      if (html) {
        selectedText = container.innerHTML;
      }

    } else if (undefined !== document.selection && "Text" === document.selection.type) {
      selTextRange = document.selection.createRange();
      textRange = selTextRange.duplicate();
      textRange.moveToElementText(el);
      if (selTextRange.compareEndPoints("EndToStart", textRange) == 1 && selTextRange.compareEndPoints("StartToEnd", textRange) == -1) {
        if (selTextRange.compareEndPoints("StartToStart", textRange) == 1) {
          textRange.setEndPoint("StartToStart", selTextRange);
        }
        if (selTextRange.compareEndPoints("EndToEnd", textRange) == -1) {
          textRange.setEndPoint("EndToEnd", selTextRange);
        }
        if (html) {
          selectedText = textRange.htmlText;
        } else {
          selectedText = textRange.text;
        }
      }
    }

    return selectedText;
  }

  /**
   * Cleanup up input text and attempt to break lines in a smart way
   *
   * @param String text
   *
   * @return String[]
   */
  function textToBlockquote(text) {
    return "> " + text
      .replace(/<\/p>/g, "\n\n")
      .replace(/<(\/div|br\/)>/g, "\n")
      .replace(/<(?:.|\n)*?>/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .replace(/\n/g, "\n> ");
  }

  /**
   * Activate a textarea element and set it as current item
   *
   * Show all quote links if hidden
   *
   * @param Input element
   *
   * @return Input
   */
  activate = function (input) {
    var show = false, k = 0;
    if (input !== currentActiveInput) {
      if (!currentActiveInput) {
        show = true;
      }
      currentActiveInput = input;
      // Show quote links *after* we actually set the active input
      if (show) {
        for (k in quoteButtons) {
          quoteButtons[k].show();
        }
        for (k in replyButtons) {
          replyButtons[k].show();
        }
      }
    }
    return currentActiveInput;
  };

  /**
   * Move viewport to
   */
  moveTo = function (id) {
    var $e = $("#" + id);
    if ($e.length) {
      $('html,body').animate({
        scrollTop: $hash.first().offset().top
      }, 200);
    }
  };

  /**
   * Find input in list
   */
  findInput = function (id) {
    var k = 0;
    for (k in InputList) {
      if (id === InputList[k].id || id === InputList[k].inputId) {
        return InputList[k];
      }
    }
    throw "Could not find input with id " + id;
  };

  /**
   * Prepare textarea form
   *
   * @param string|Input id
   * @param Object data
   * @param string backToId
   */
  focusTo = function (input, data, backToId) {
    var k = 0, $cur, $hash;

    if (!input instanceof Input) {
      input = findInput(input);
    }

    // Update form data if necessary 
    if (data && input.$form.length) {
      for (k in data) {
        $cur = input.$form.find("input[name=" + k + "]");
        if ($cur.length) {
          $cur.val(data[k]);
        }
      }
    }

    if (backToId) {
      input.$backTo.attr("href", "#" + backToId); 
      input.$backTo.css({display: "block"});
    } else {
      input.$backTo.hide();
    }

    // Expand textarea and focus it, also move the viewport to it
    $(input.target).trigger('autosize.resize');

    if (input.id) {
      window.location.hash = input.id;
    }
    input.target.focus();
  };

  /**
   * Textarea behavior
   */
  $.fn.magicTextarea = function (options) {

    options = options || {};
    if (!options.defaultClass) {
      options.defaultClass = "default";
    }

    this.each(function () {
      if ("textarea" === this.type) {

        var
          input = new Input(this),
          $target = $(input.target);

        InputList.push(input);

        // Initialize the jQuery.autosize() plugin if present
        if (autoSizeEnabled) {
          $target.autosize();
        }

        $target.on("focus", function () {
          activate(input);
        });
        if (options.activate || $target.is("." + options.defaultClass)) {
          activate(input);
        }
      }
    });
  };

  /**
   * Quote button behavior
   */
  $.fn.magicQuoteButton = function () {

    if (!this.length) {
      return;
    }

    if (!currentActiveInput) {
      this.hide();
    }
    quoteButtons.push(this);

    this.on("click", function (ev) {

      var
        element,
        clean,
        content,
        title = "",
        input,
        cid = "";

      ev.preventDefault();
      ev.stopPropagation();

      if (this.attributes["data-target"]) {
        element = document.getElementById(this.attributes["data-target"].value);
        if (element) {

          // For some reasons we sometime have a lot of textareas in the
          // page and want to force quote to go in a single one depending
          // on the quote button clicked; This implements this feature and
          // leave it optional.
          if (this.attributes["data-input"]) {
            try {
              input = activate(findInput(this.attributes["data-input"].value));
            } catch (error) {
              input = currentActiveInput;
            }
          }

          if (!input) {
            return;
          }

          content = getSelectedTextWithin(element, true).trim();
          if (!content) {
            content = element.innerHTML.trim();
          }

          clean = textToBlockquote(content);

          // Compute title
          if (element.attributes["data-title"] && "" !== element.attributes["data-title"].value) {
            title = "**" + element.attributes["data-title"].value  + " :**\n";
          }

          // Append all the things!
          if ("" === input.target.value) {
            input.target.value = title + clean + "\n\n";
          } else {
            input.target.value = input.target.value + "\n\n" + title + clean + "\n\n";
          }

          if (this.attributes["data-cid"]) {
            cid = this.attributes["data-cid"].value;
          }

          focusTo(input, {}, (cid ? "comment-" + cid : element.id));
        }
      }
    });
  };

  /**
   * Reply button behavior
   */
  $.fn.magicReplyButton = function () {

    if (!this.length) {
      return;
    }

    if (!currentActiveInput) {
      this.hide();
    }
    replyButtons.push(this);

    this.on("click", function (ev) {
      var cid, input = currentActiveInput;

      if (input && this.attributes["data-cid"]) {

        ev.preventDefault();
        ev.stopPropagation();

        cid = this.attributes["data-cid"].value;

        focusTo(input, { pid: cid }, "comment-" + cid);
      }
    });
  };

  /**
   * Drupal behavior
   */
  Drupal.behaviors.magiText = {
    attach: function (context) {
      $("textarea.magitext", context).once('magitext').magicTextarea();
      $(".magiquote", context).once('magitext').magicQuoteButton();
      $(".magireply", context).once('magitext').magicReplyButton();
      // Activate at least one textare to show quote links
      if (!currentActiveInput && InputList.length) {
        activate(InputList[0]);
      }
    }
  };

}(document, jQuery));
