/*jslint browser: true, todo: true, indent: 2 */
/*global Markdown, Drupal, jQuery */
(function ($) {
  "use strict";

  Drupal.PageDown = {Instances: {}};
  var converter = new Markdown.Converter();

  function spawn(postfix) {
    var editor, options;
    // You know what's fun here? If we set this variable
    // after the MarkdownEditor init, some other async code
    // will run the attachBehavior() a certain amount of times
    // and re-run it before it actually happened; This makes our
    // code being run more than 5 or 6 times just the time it
    // takes for the editor to fully init. Hence the once which
    // seems to actually have a good exclusion mecanism.
    $("#wmd-input" + postfix).once('pagedown', function () {
      if (!Drupal.PageDown.Instances[postfix]) {
        try {
          options = {};
          if (Drupal.settings.PageDown.Locale) {
            options.strings = Drupal.settings.PageDown.Locale;
          }
          editor = new Markdown.Editor(converter, postfix, options);
          editor.hooks.chain("onPreviewRefresh", function () {
            // We don't really have better place to do this, so let's
            // use this hook.
            setTimeout(function () {
              $("#wmd-input" + postfix).trigger("autosize.resize");
            }, 0);
          });
          editor.run();
          Drupal.PageDown.Instances[postfix] = editor;
        } catch (e) {
          if (console && console.log) {
            console.log("Cannot spawn Markdown.Editor, exception is: " + e);
          }
          Drupal.PageDown.Instances[postfix] = {error: true};
        }
      }
    });
  }

  Drupal.behaviors.quotedown = {
    attach: function (context) {
      var k, postfix;

      // Attach Markdown PageDown editor.
      if (Markdown && Markdown.Editor && Drupal.settings.PageDown && Drupal.settings.PageDown.List) {
        for (k in Drupal.settings.PageDown.List) {
          postfix = "-" + Drupal.settings.PageDown.List[k];
          spawn(postfix);
        }
      }

      // Attach standalone instances.
      $(context).find('.pagedown-standalone').once('pagedown-standalone', function () {
        $(this).each(function () {
          var $this = $(this);
          var postfix = $this.attr('data-postfix');
          $this.addClass('wmd-input');
          if (!postfix) {
            postfix = '-' + new Date().valueOf();
          } else {
            postfix = '-' + postfix;
          }
          $this.attr('id', 'wmd-input' + postfix);
          spawn(postfix);
        });
      });
    }
  };
}(jQuery));