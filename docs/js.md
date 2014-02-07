# Javascript

Headstart uses a predefined JS file setup, but it is relatively easy to get started once you get familiar with it.
All .js files will be injected dynamically in a predefined order that takes care of dependencies for you.

The top-level classes are based on the [module pattern](http://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/) to provide you with public/private functionality. All files are commented to provide you with visual cues as to what each code "group" does.

## App

The App class is a self-instantiating class that instantiates all dependencies when the view is done loading. This is a top-level class that rarely needs editing.

It comes with multiple getters to make the other classes easily accessible from anywhere, and gives you a centralised dispatcher for event communication.

Example:

    // Dispatch from anywhere
    App.dispatcher.trigger('foo', { bar: 'foobar' });
    
    // Receive anywhere
    App.dispatcher.on('foo', function(e, data){
        log(data); // {bar: 'foobar'}
    });
    
## View

The page-specific script files (eg. `view-index.js`) will only be injected in their target page, and will always be loaded last (replacing document.ready by depending on the standard script blocking).

> __NOTE: File names should be prefixed with "view-", followed by the name of the target .html file__

Inside of the view, you can use whatever code structure you like, but you are provided with one that works pretty good and encourages you to put structure into your code.

At the bottom of the view, the app is told to initiate itself, with a new instance of the View defined above. It might seem like the code is juggling references, but as your view might have dependencies on other classes, it is easier to have its constructor called by the App class.

### Vars

Variables are grouped at the top, preferably with subgroups when possible. This makes it easy to refer to later on, and gets rid of those nasty strings.

Example of a subgroup:

    var $slider = {
        self: $('.slider'),
        slides: $('.slider li'),
        prevButton: $('.slider .prev'),
        nextButton: $('.slider .next')
    };

### Constructor

This function is returned in the public part at the bottom of the file, and will be used by the application to start up the view class.
When this function is called, you can be sure that all files have been loaded.

By default this function calls the private function `_addActions()`, which can be used to bind listeners.

### Public functions

At the bottom of the View class, an object is returned containing the constructor, as well as any other function you would like to have shared among your other classes.

## Libraries

A handfull of libraries, plugins and patches provide you with comfort as things like pseudo-selectors, 
semantic elements and media queries just work! Cross-browser!

 + HTML5shiv
 + jQuery
 + [Underscore](http://underscorejs.org)
 + [Log.js](https://github.com/adamschwartz/log) for logging in style
 + IE fixes
   + [Respond.js](http://j.mp/respondjs)
   + [Selectivizr](http://selectivizr.com) — in combination with [NWMatcher](http://javascript.nwbox.com/NWMatcher/)

## Classes

Ready-to-use classes:

 + API — A handy wrapper for your API calls
 + Utils
   + `form.serializeObject()` will come in handy for your Api calls
   + `insertReporting()` helper function for injecting feedback messages
 + App — Global wrapper for app-wide logic
 + Views — Each page is probably a view
