# QuoteDown

This Drupal module brings content and comment editing features:

 *  Brings a **MarkDown text filter**: the existing 
    [*Markdown* module](http://drupal.org/project/markdown) uses an
    outdated PHP library; This module uses the same but up-to-date;

 *  Brings the [**PageDown editor**](http://code.google.com/p/pagedown)
    (*StackOverflow*'s Markdown editor) as a **field formatter** and a
    single **form element**;

 *  Adds a **quotation feature for comments and forums**; Fully JavaScript
    driven it cleans up any text and paste it into the currently active
    editor as a well formed Markdown blockquote;

 *  Brings **jQuery.autosize** plugin for textarea elements autosizing
    depending on content: this plugin is not supposed to work with jQuery
    <= 1.7 but this modules also brings a jQuery compat layer for older
    version to make it work;

## Usage

### For users

Enable the module and configure your fields with the *PageDown editor*
field formatter. That should be enough.

This filter format can be changed manually; Just avoid to remove the
*Markdown* filter or it won't work as expected anymore.

It is very important to understand that by definition Markdown allow
users to plug fullon HTML into their Markdown content, and won't filter
it: that's why the *qmarkdown* pre-configured filter format is provided
with this module and forced to be the default whenever a textarea is being
altered.

### For developers and integrators

#### Working with *textarea* element type

 *  The various behaviors on textareas will be automatically intialized for
    the textarea with the *magitext* CSS class. This CSS class is added by
    the textarea element process handler, and is present per default.

 *  Any textarea with the *default* CSS class will be auto-focused on page
    load (if more than one have the CSS class default focused one is not
    predictable).

 *  Add *#pagedown* property and set it to *true* will add the PageDown
    editor on the textarea (default is set to *false*).

 *  Add *#magitext* property and set to *false* will disable the *magitext*
    jQuery behavior (default is set to *true*).

Since the module alters the definition of the *textarea* element this applies
to all textareas Drupal will spawn.

#### Working with *text_format* element type

All the rules for the *textarea* element type are true for the *text_format*
element type. Plus:

 *  Per default all elements are altered to use the *qmarkdown* input
    filter (forced pragmatically) and format choice is being hidden.

 *  Change the value of the *#forceformat* key to *false* will disable
    the default alteration.

 *  Change the value of the *#forceformat* key to any known filter format
    identifier will reproduce the default behavior using this filter format.

#### Working with quotation

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
