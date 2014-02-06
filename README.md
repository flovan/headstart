    ▒█░▒█ █▀▀ █▀▀█ ▒█▀▀▄ █▀▀ ▀▀█▀▀ █▀▀█ █▀▀█ ▀▀█▀▀ 
    ▒█▀▀█ █▀▀ █▄▄█ ▒█░▒█ ▀▀█ ░▒█░░ █▄▄█ █▄▄▀ ░▒█░░ 
    ▒█░▒█ ▀▀▀ ▀░░▀ ▒█▄▄▀ ▀▀▀ ░▒█░░ ▀░░▀ ▀░▀▀ ░▒█░░

    A easy-to-use Gulp framework/boilerplate/template/whatever.
    Comes with a base file setup and uses Gulp for compilation.
    

## Setup

+ [Install Node.js and NPM](http://nodejs.org)
+ Open your CLI (eg. Terminal)
+ Install Gulp globally by running `(sudo) npm install -g gulp`
+ Install Compass globally by running `(sudo) npm install -g compass`
+ Navigate to your project folder (eg. `cd my/folder/location` or drag your folder onto the Terminal app)
+ Install dependencies by running `sudo) nmp install`

## Usage

+ Run `gulp` to initiate the development stage
+ Run `gulp --production` to generate your production ready files
+ Open your browser at `http://localhost:9000/myfile.html` and start coding!

## Structure

### HTML

Headstart provides you with a solid HTML foundation, based on the [HTML5 Boilerplate](http://html5boilerplate.com), but extended with *those things you always end up needing*:

 + `<meta>` tags for everything!
 + A lot of handy `<link>`s, some commented out, but all ready to use

###CSS

Headstart's CSS is powered by SASS (SCSS), and utilizes a custom grid system based on [Suzy](http://susy.oddbird.net).

The setup works with a common.css file, which contains the site-wide (and repetitive) styles, accompanied by a page-specific css file (see the `page-template.scss` file) <del>which should be inserted through the back-end</del> **I am working on doing this automatically**.

The folder structure and base file setup is based on [BEM](http://bem.info/method/definitions/) and [SMACSS](http://smacss.com). 
If you haven't heard about these two, you might also want to read these 2 articles: [1](https://medium.com/objects-in-space/f6f404727) [2](http://webuild.envato.com/blog/how-to-scale-and-maintain-legacy-css-with-sass-and-smacss/).



###JS

<del>Being intended for web content requiring heavier database traffic and multiple pages, 
Headstart uses a JS setup that I put together over the course of the last projects that I worked on.
So there are bound to be some changes in the future, such as looking further into RequireJS, or even a Backbone implementation.</del>

**Will be updated soonish**

####Libraries

A handfull of libraries, plugins and patches provide you with comfort as things like pseudo-selectors, 
semantic elements and media queries just work! Cross-browser!

 + HTML5shiv
 + jQuery
 + [Underscore](http://underscorejs.org)
 + [Log.js](https://github.com/adamschwartz/log) for logging in style
 + IE fixes
   + [Respond.js](http://j.mp/respondjs)
   + [Selectivizr](http://selectivizr.com) — in combination with [NWMatcher](http://javascript.nwbox.com/NWMatcher/)

####Classes

Ready-to-use classes:

 + API — A handy wrapper for your API calls
 + Utils
   + `form.serializeObject()` will come in handy for your Api calls
   + `insertReporting()` helper function for injecting feedback messages
 + App — Global wrapper for app-wide logic
 + Views — Each page is probably a view
