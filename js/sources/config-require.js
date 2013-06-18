//
// CORE UTILS ------------------------------------------------------------------------
//
// Note: If you're not using CodeKit to include snippets, you can
// prepend snippets with Grunt, some other build script/suite
// or copy/paste manually
//
// Important: __utils.js sets up a global namespace for all utilities
// Add this snippet before adding any other utilities
//

// @codekit-prepend "__utils.js"
// @codekit-prepend "__utils.clientDetection.js"




//
// REQUIRE CONFIG --------------------------------------------------------------------
//
// Async setup using AMD loading
// Note: using CDN with local fallback
// http://requirejs.org/docs/api.html#config
//

require.config({

    //
    // MAIN ENTRY POINT OF THE APPLICATION -------------------------------------------
    //

    deps: ['app-require.min'],

    //
    // PATH MAPPINGS FOR MODULES -----------------------------------------------------
    // Note: relative to js/app.min.js
    //

    paths:
    {
        // This setup uses Zepto (10kb) as default DOM library
        // For IE we fallback to jQuery.js (93kb) as Zepto doesn't support IE
        // Note: Zepto doesn't support $(el).fadeIn(), $(el).fadeOut() -> use $(el).animate({ 'opacity': value })
        // Note: Zepto doesn't support $(el).slideDown(), $(el).slideUp() either
        // See http://zeptojs.com for full spec

        'dom': (Utils.client.isIE ?
            ['//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.0/jquery.min', 'libs/jquery-1.10.0.min'] :
            ['//cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min', 'libs/zepto.min']),

        // Backbone, using Lo-Dash instead of Underscore
        // http://lodash.com

        'json2':      ['//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2', 'libs/json2.min'],
        'underscore': ['//cdnjs.cloudflare.com/ajax/libs/lodash.js/1.2.1/lodash.min', 'libs/lodash-1.2.1.min'],
        'backbone':   ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min', 'libs/backbone-1.0.0.min']
    },

    //
    // CONFIGURE DEPENDENCIES & EXPORTS ----------------------------------------------
    //

    shim:
    {
        // Since the DOM library is client dependant, we need to export its module name
        // http://stackoverflow.com/questions/8735674/in-requirejs-cannot-alias-jquery-name-in-path

        'dom':
        {
            exports: (Utils.client.ieIE ? 'jQuery' : 'Zepto')
        },

        // Backbone depends on json2 (IE7), Underscore (Lo-Dash) & a DOM library
        // Dependencies need to be loaded, then export the module name

        'backbone':
        {
            deps: ['json2', 'underscore', 'dom'],
            exports: 'Backbone'
        },

        // Underscore (Lo-Dash)

        'underscore':
        {
            exports: '_'
        }
    }
});