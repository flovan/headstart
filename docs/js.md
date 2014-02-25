# Javascript

Headstart uses a predefined JS file setup, but it is relatively easy to get started once you get familiar with it.
All .js files will be injected dynamically in a predefined order that takes care of dependencies for you.

The top-level classes are based on the [revealing module pattern](http://carldanley.com/js-revealing-module-pattern/) to provide you with public/private functionality. All JS code is written (more or less) as defined in [idiomatic.js](https://github.com/rwaldron/idiomatic.js/).

jQuery is used for some functionalities, but, as you probably know, you can mix this with vanilla javascript to your hearts content.

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

## Config

A simple wrapper class for your global project settings.

## API

A class that extends the default ajax functionality of jQuery. The only function you'll ever need is `call()`, which can be passed in some settings to have it do what you want. A public `route` object contains the routes to your API.

Example:
    
    App.api.call(App.api.routes.someRoute, {
        values: { something: 'this', isCool: true },
        done: function(data){
            log('Returned data from route', data);
        },
        fail: function(err){
            log('Route call failed', err);
        }
    });
    
When `cancellable` is set to `true`, the call will be monitored on its duration (as set in the Config class). With  a two-step event setup, you will be notified when your call is hanging or when it has been cancelled.

## Events

Adds a global `EVENTS` object that encourages globalized event names. Down with hard to manage strings! This is of course completely optional; just remove the file if you won't be needing this.

## Log

Headstart makes use of the great [log()](https://github.com/adamschwartz/log) library by [Adam Schwartz](https://github.com/adamschwartz).

Safely call `log()` instead of `console.log()`. Also, log bold, italic or colored text, and even code blocks! Check out the repo for all options.

Example:
    
    log('*This is italic*');
    log('**This is bold**);
    log('This piece is [c="color: red"]red[c]');

## Utils

The Utils class is a handy wrapper for functionality that you need throughout your website. By default the class comes with a few function: `isTouch()` (self-explanatory), `insertReporting()` function (making it easy to inject feedback into the DOM), and `share()` (Share your page through various social channels).

This file also includes a patch for jQuery to include a function that serializes forms into objects, which is handy when using POST API calls.

Most of the default Utils functionality is commented out to make sure you're not including excess code into your files.

## Libraries

Headstart uses a few libraries by default.

 + jQuery (latest 1.x release)
 + [Underscore](http://underscorejs.org) — for its powerfull array, debounce and throttle functions.
 + IE libs
   + html5shiv — making your fancy elements function properly.
   + [Respond.js](http://j.mp/respondjs) — making your media queries work.
   + [Selectivizr](http://selectivizr.com) + [NWMatcher](http://javascript.nwbox.com/NWMatcher/) — Use all the fancy selectors you want, without concequences.
   + PIE — making your CSS3 rules work, [read the docs](http://css3pie.com/documentation/).
