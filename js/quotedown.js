/*jslint browser: true, todo: true, indent: 2 */
/*global Markdown, Drupal, jQuery */
(function ($) {
  "use strict";
  Drupal.behaviors.quotedown = {
    attach: function (context) {
      // Attach Markdown PageDown editor.
      var k = 0, converter, editor, postfix, options;
      if (Markdown && Markdown.Editor && Drupal.settings.PageDown.List) {
        Drupal.PageDown = {Instances: {}};
        converter = new Markdown.Converter();
        for (k in Drupal.settings.PageDown.List) {
          postfix = "-" + Drupal.settings.PageDown.List[k];
          // You know what's fun here? If we set this variable
          // after the MarkdownEditor init, some other async code
          // will run the attachBehavior() a certain amount of times
          // and re-run it before it actually happened; This makes our
          // code being run more than 5 or 6 times just the time it
          // takes for the editor to fully init. Hence the once which
          // seems to actually have a good exclusion mecanism.
          $("#wmd-input" + postfix, context).once('pagedown', function () {
            if (!Drupal.PageDown.Instances[postfix]) {
              try {
                options = {};
                if (Drupal.settings.PageDown.Locale) {
                  options.strings = Drupal.settings.PageDown.Locale;
                }
                editor = new Markdown.Editor(converter, postfix, options);
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
      }
    }
  };
}(jQuery));