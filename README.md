# QuoteDown

This Drupal module brings content and comment editing features:

 *  Brings a **MarkDown text filter**: the existing 
    [*Markdown* module](http://drupal.org/project/markdown) uses an
    outdated PHP library; This modules uses the same but up-to-date;

 *  Brings the **PageDown editor** (*StackOverflow*'s MarkDown editor)
    as a **field formatter** and a single **form element**;

 *  Adds a **quotation feature for comments and forums**; Fully JavaScript
    driven it cleans up any text and paste it into the currently active
    editor as a well formed MarkDown blockquote;

 *  Brings **jQuery.autosize** plugin for textarea elements autosizing
    depending on content: this plugin is not supposed to work with jQuery
    <= 1.7 but this modules also brings a jQuery compat layer for older
    version to make it work;

## Usage

### For users

Enable the module and configure your fields with the *PageDown editor*
field formatter. That should be enough. Note that your users must have
the permission to use the *quotedown* filter format.

This filter format can be changed manually; Just avoid to remove the
*MarkDown* filter or it won't work as expected anymore.

It is very important to understand that by definition Markdown allow
users to plug fullon HTML into their Markdown content, and won't filter
it: that's why the *quotedown* pre-configured filter format is provided
with this module.

### For developers and integrators

The various behaviors on textareas will be automatically intialized for
the textarea with the "magic" CSS class. Any textarea with the "default"
CSS class will be auto-focused on page load.

For the quotation feature, you have to respect a certain amount of
pre-requisites:

 *  Any *quote link* must have the *rel* attribute carrying the element
    id it refers too (the one which contains the content to quote). It
    worthes to note that the content can be complex and structured HTML
    content, all tags will be stripped from the quotation but whitespaces
    and line breaks will be kept;

 *  The target element (the on referred in the *rel* attribute) may
    carry a *title* attribute: it will be used as quote header in the
    pasted text;

 *  Apply the class *magiquote* to those links and it will be automatically
    initialized on page load and work gracefully with any initialized
    textarea on the same page.

Please see *quotedown\_comment\_view\_alter()* implementation for a complete
and working usage.

## Compatibility

I am not really sure if this will work gracefully on every browser;
Nevertheless *jQuery.autosize* I'm quite sure it will thanks to jQuery.
Considering that the *PageDown* editor is used on the biggest IT Q&A site
on earth and that it has been developped and maintained by one of the best
team of IT guys out there for the last few years, I'm quite sure it will
work pretty much everywhere.

## Dependencies

This module can leverage the
[*autoloader* module](http://github.com/makinacorpus/drupal-autoloader) for
loading the markdown library. That's prety much the only dependency (and it
is a soft dependency).

## Future

No future plans except adding minor editor features or updating the libraries
it uses.
