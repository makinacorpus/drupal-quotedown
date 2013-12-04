/*jslint browser: true, todo: true, indent: 2 */
/*global jQuery */
(function (document, $) {
  "use strict";
  Drupal.behaviors.quotedown = {
    attach: function (context) {
      // Attach Markdown PageDown editor.
      var k = 0, converter, editor, postfix;
      if (Markdown && Markdown.Editor && Drupal.settings.pageDown) {
        converter = new Markdown.Converter();
        Drupal.settings.pageDownEditors = {};
        for (k in Drupal.settings.pageDown) {
          postfix = "-" + Drupal.settings.pageDown[k];
          // You know what's fun here? If we set this variable
          // after the MarkdownEditor init, some other async code
          // will run the attachBehavior() a certain amount of times
          // and re-run it before it actually happened; This makes our
          // code being run more than 5 or 6 times just the time it
          // takes for the editor to fully init. Hence the once which
          // seems to actually have a good exclusion mecanism.
          $("#wmd-input" + postfix, context).once('pagedown', function () {
            if (!Drupal.settings.pageDownEditors[postfix]) {
              try {
                editor = new Markdown.Editor(converter, postfix);
                editor.run();
                Drupal.settings.pageDownEditors[postfix] = editor;
              } catch (e) {
                if (console && console.log) {
                  console.log("Cannot spawn Markdown.Editor, exception is: " + e);
                }
                Drupal.settings.pageDownEditors[postfix] = {error: true};
              }
            }
          });
        }
      }
    }
  };
}(document, jQuery));