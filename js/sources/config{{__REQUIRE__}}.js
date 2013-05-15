//
// ADD CLIENT DETECTION --------------------------------------------------------------
//
// Note: If you're not using CodeKit to include snippets, you can
// prepend snippets with Grunt, some other build script/suite
// or copy/paste it manually
//

// @codekit-prepend "__utils.clientdetection.js"




//
// REQUIRE CONFIG --------------------------------------------------------------------
//
// http://requirejs.org/docs/api.html#config
//

require.config({

	// Dependencies - main entry point of the app
	deps: ['app{{__REQUIRE__}}.min']



















/*
	paths:
    {
        dom: (isIE ? ['http://code.jquery.com/jquery.min', 'libs/jquery-1.9.0.min'] :
                     ['http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0rc1/zepto.min', 'libs/zepto.min'])


	/  *
        ,

        // backbone
        json2:       ['http://cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2', 'libs/json2.min'],
        underscore:  ['http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min', 'libs/underscore.min'],
        backbone:    ['http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min', 'libs/backbone.min'],

        // zynga custom scroll (un-minified)
        animate:    'libs/zynga/animate',
        render:     'libs/zynga/render',
        zynga:      'libs/zynga/scroller',

        // utils
        utils:      'utils/utils',
        events:     'utils/events',
		
        // plugins
        add2home:   'libs/add2home'

        *  /

    },
    shim:
    {
        // Zepto doesn't support AMD loading, jQuery supports it as of version 1.7.
        // to do this, it defines a module named 'jquery' which passes back a reference to the jQuery object
        // when you define your path to jquery with another name (eg 'jqueryA'), things aren't working
        // http://stackoverflow.com/questions/8735674/in-requirejs-cannot-alias-jquery-name-in-path
        dom:
        {
            exports: (isIE ? 'jQuery' : 'Zepto')
        }

		/  *
        ,

        // backbone depends on json2, underscore & a dom library
        // dependencies need to be loaded before backbones inititializes
        // once they've been loaded, export 'Backbone' as the module value
        backbone:
        {
            deps: ['json2', 'underscore', 'dom'],
            exports: 'Backbone'
        },

        // Zynga scroller depends on animate, render & a dom library
        // loaded in that specific order
        zynga:
        {
            deps: ['animate', 'render', 'dom']
        }
        *   /

    }
    */

});