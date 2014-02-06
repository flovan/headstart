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
