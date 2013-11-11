# Headstart Lite 0.2

####A front-end boilerplate

In this time of automated workflows, I take pleasure in *hand-gardening* this project.

### HTML

Headstart Lite provides you with a solid HTML foundation, based on the [HTML5 Boilerplate](http://html5boilerplate.com), 
but extended with *those things you always end up needing*.

It also includes bits and pieces of Gwen Vanhee's [Boilerplate](https://github.com/gwenvanhee/Boilerplate-0.2)

####`<meta>` tags for everything!

SEO tags? Check. Viewport and web app tags? Check. Windows also? Yup. Windows tile tags? Check.
What about social sharing? It's all in here.

####`<link>` it up

Also included in the HTML are a few handy links:
 + DNS-prefetch (Google Webfonts, Google Analytics, and Google Ajax for jQuery)
 + Favicon and the ever-growing list of web app icons for iOS
 + Your CSS, of course!
 + Some CSS and JS based fixes for IE, so you can (almost) stop thinking about it
 + A ready to use js file

###CSS

For maintainability reasons, Headstart Lite's CSS is compiled with Compass and SCSS, and utilizes a trimmed down version 
of [Suzy](http://susy.oddbird.net) to take care of the responsive grid. Included are some other handy mixins, 
and a few modules.
The folder structure and base file setup is based on [BEM](http://bem.info/method/definitions/) and [SMACSS](http://smacss.com). 
If you haven't heard about these two, you might also want to read these 2 articles: [1](https://medium.com/objects-in-space/f6f404727) [2](http://webuild.envato.com/blog/how-to-scale-and-maintain-legacy-css-with-sass-and-smacss/).

Check out the `demo.html` file and the `/assets/sass/demo-module` folder for an example. 
A more thourough write-up will be published elsewhere later.

###JS

Unlike it's bigger brother, the Lite version of Headstart comes with one .js file to contain all your javascript and jQuery code.

####Libraries

A handfull of libraries, plugins and patches provide you with comfort as things like pseudo-selectors, 
semantic elements and media queries just work! Cross-browser!

 + HTML5shiv
 + jQuery
 + [Underscore](http://underscorejs.org)
 + [Log.js](https://github.com/adamschwartz/log) for logging in style
 + IE fixes
   + [Html5 Placeholder Polyfill](http://blog.ginader.de/dev/jquery/HTML5-placeholder-polyfill/)
   + [Respond.js](http://j.mp/respondjs)
   + [Selectivizr](http://selectivizr.com) — in combination with [NWMatcher](http://javascript.nwbox.com/NWMatcher/)
   + [IE7/IE8/IE9.js](http://code.google.com/p/ie7-js/)
+ Utils
   + `form.serializeObject()` will come in handy for your Api calls
   + Debounce-able `resize()` and `scroll()` function
   + `insertReporting()` helper function for displaying feedback messages
 
###TODO

 + Make a better demo page
 + Test cross-browser support (should be alright though)