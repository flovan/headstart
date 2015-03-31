- [Boilerplate](#boilerplate)
- [File structure](#file-structure)
- [Dot files](#dot-files)
  - [.headstartrc](#headstartrc)
  - [.jshintrc](#jshintrc)
- [Assets](#assets)
- [Templating](#templating)
- [Miscellaneous](#miscellaneous)

## Boilerplate

One of the core features of Headstart is its ability to scaffold a skeleton project on command. As covered in the [CLI document](cli.md), a new project can be instantiated by running:

````
headstart new
hs new
````

Doing this fetches a new copy of [the default boilerplate][boilerplate-url], which contains templates, libraries and styles to help you get started really fast. The used methods, libraries and coding style are opinionated, but you can always [make a custom version](guides/customize-the-boilerplate.md) and start off with that.

## File structure

This is the tree representation of a skeleton project:

````
.headstartrc
.jshintrc
assets
|-- images
|   `-- _tpl
|-- meta
|-- js
|   |-- core
|   |-- ie
|   |   |-- body
|   |   `-- head
|   |-- libs
|   `-- dev
`-- sass
    |-- base
    |-- libs
    |-- mixin
    |-- module
    `-- vendor
misc
templates
|-- layout
`--partials
````

## Dot files

Inside of your project folder root, you'll find two (hidden) "dot files". You will probably be able to see them in your code editor, or by configuring your OS to show hidden files.

### .headstartrc

This is the main configuration for any project. Here's a commented version of all the options (don't put comments in your own files though, it's not valid JSON):

````json
{
    // Minify your templates
    // eg. remove comments, collapse whitespace, ...

    "minifyHTML": false,

    // Combine media queries where possible
    // Gzipping takes care of repeating strings, so this isn't
    // really necessary

    "combineMediaQueries": false,

    // Which browsers to autoprefix
    // More examples here: https://github.com/postcss/autoprefixer#browsers

    "prefixBrowsers": ["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1"],


    // Check your javascript syntax and output the results
    // Configured through `./.jshintrc`
    // All options here: http://www.jshint.com/docs/options/

    "hint": true,

    // Validate your files through W3C and ouput the results

    "w3c": false,

    // Folder where the assets folder should be built to

    "export_assets": "export",

    // Folder where the individual templates should be built to

    "export_templates": "export",

    // Folder where the miscellaneous assets should be built to
    // Usually identical to "export_assets"

    "export_misc": "export",

    // Assemple templates during build
    // Turn this off when eg. a back-end will do the assembly

    "assemble_templates": true,

    // Prefix injected script and link tags
    // eg. "{{Url::asset('/')}}" for Laravel

    "template_asset_prefix": "",

    // Turn on revisioning to get better caching

    "revisionCaching": false,

    // You can set a custom port if want to or need to because
    // the default port (3000) is already taken

    "port": 1234,

    // You can enable a proxy if you want browser-sync to work
    // through a different host (eg. when viewing your project
    // through your MAMP/XAMP localhost)

    "proxy": "localhost/my-laravel-project/public",

    // Use a different name for the assets folder

    "assetsFolder": "assets",

    // Configure how your HTML will be minified
    // Default settings show below
    // All options here: https://github.com/kangax/html-minifier#options-quick-reference

    "htmlminOptions" : {
        "removeComments":                true,
        "collapseWhitespace":            true,
        "collapseBooleanAttributes":     true,
        "removeAttributeQuotes":         true,
        "useShortDoctype":               true,
        "removeScriptTypeAttributes":    true,
        "removeStyleLinkTypeAttributes": true,
        "minifyJS":                      true,
        "minifyCSS":                     true
    }
}
````

### .jshintrc

Headstart makes use of JSHint to check your Javascript syntax while you code. This can help you prevent bugs before even running into them, but this also forces you to write better code overall, in a friendly way.

These are the default setting:

````json
{
  "strict": true,
  "camelcase": true,
  "eqeqeq": true,
  "nonbsp": true,
  "quotmark": "single",
  "node": true,
  "trailing": true,
  "maxparams": 3,
  "jquery": true
}
````

Take a look at [all the JSHint options][jshint-url] if you plan on [customizing your boilerplate](guides/customize-the-default-boilerplate.md).

## Assets

Images, SCSS and Javascript files. More in the [assets document](assets.md).

## Templating

Headstart comes with a light templating engine. More in the [templating document](templating.md).

## Miscellaneous

This directory contains extra files that need to end up in the root directory of your build. Included are:

- `htaccess.tpl` — A template of the `.htacess` file.
- `humans.txt` — *We are people, not machines.* Read more [here][humans-url].
- `robots.txt` — A behaviour sheet for robots and content spiders. Read more [here][robots-url].

## What's next?

The boilerplate structure has been demystified. Now's a good time to take a closer look at [the assets document](assets.md) or [the templating document](templating.md).

[boilerplate-url]: https://github.com/flovan/headstart-boilerplate
[humans-url]: http://humanstxt.org/
[robots-url]: http://www.robotstxt.org/
[jshint-url]: http://www.jshint.com/docs/options/
