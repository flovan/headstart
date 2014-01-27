# Headstart 0.2

####A front-end boilerplate for  web apps and platforms.

In this time of automated workflows, I take pleasure in *hand-gardening* this project. This is the grown-up version of my personal boilerplate <del>(now [branched](http://github.com/flovan/Headstart-0.2/tree/lite) as 'lite')</del>.

_UPDATE: This project is being updated. Changes not yet reflected on lite branch._

### HTML

Headstart provides you with a solid HTML foundation, based on the [HTML5 Boilerplate](http://html5boilerplate.com), 
but extended with *those things you always end up needing*.

It also includes bits and pieces of Gwen Vanhee's [Boilerplate](https://github.com/gwenvanhee/Boilerplate-0.2)

 + `<meta>` tags for everything!
 + A lot of handy `<link>`s, some commented out, but all ready to use

###CSS

Headstart's CSS is compiled with Compass and SCSS, and utilizes a custom grid system based on on [Suzy](http://susy.oddbird.net). Included are some other handy mixins, 
and a few modules.

The setup works with a common.css file, which contains the site-wide (and repetitive) styles, accompanied by a page-specific css file (see the `page-template.scss` file) which should be inserted through the back-end.

The folder structure and base file setup is based on [BEM](http://bem.info/method/definitions/) and [SMACSS](http://smacss.com). 
If you haven't heard about these two, you might also want to read these 2 articles: [1](https://medium.com/objects-in-space/f6f404727) [2](http://webuild.envato.com/blog/how-to-scale-and-maintain-legacy-css-with-sass-and-smacss/).



###JS

<del>Being intended for web content requiring heavier database traffic and multiple pages, 
Headstart uses a JS setup that I put together over the course of the last projects that I worked on.
So there are bound to be some changes in the future, such as looking further into RequireJS, or even a Backbone implementation.</del>

_In need of update..._

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
   + Debounce-able `resize()` and `scroll()` function
   + `insertReporting()` helper function for displaying feedback messages
 + App — Global wrapper for app-wide logic
 + Views — Each page is probably a view
