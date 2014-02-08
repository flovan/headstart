# HTML

Headstart provides you with a solid HTML foundation, based on the [HTML5 Boilerplate](http://html5boilerplate.com), but extended with *those things you always end up needing*.

> __NOTE: For the sake of maintaining the conditionally included CSS and JS patches, and supporting < IE9, the minification of HTML files doesn't strip away comments. If you don't need to support older browsers, you can do away with the option at line 269 in the [gulpfile](https://github.com/flovan/Headstart/blob/master/gulpfile.js) to get truly minified HTML.__

## `meta` tags for everything

 + `description`, `keywords` and `author` tags — basic SEO is nice to have
 + `robots` — visiting robots should use the above tags
 + `google` — Hide the translate bar by default
 + `viewport` and other mobile tags — Make mobile browsers behave
 + `touch-icon`, `tile-icon` and `favicon` — Provide icons for web-apps
 + `Twitter`, `Facebook` and `Google+` — Custom share information

## `link` it up

 + *DNS prefetching* for the most common domain URLs. (commented out by default)

## Internet Explorer

 + Conditional tags for specific targeting. __Note: this will be removed soon-ish__
 + < IE9 browsers get a specific stylesheet and some bundled scripts to make them behave (somewhat).
 + Browsehappy link __Note: this will be removed soon-ish__

## Other

 + Google Analytics placeholder
