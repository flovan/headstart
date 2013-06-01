define([

    'dom',
    'underscore',
    'backbone'

], function($, _, Backbone)
{
	//
    // CORE UTILS ------------------------------------------------------------------------
    //
    // Note: If you're not using CodeKit to include snippets, you can
    // prepend snippets with Grunt, some other build script/suite
    // or copy/paste it manually
    //
    // Note: global namespace for all utilities and clientdetection
    // are already present (we add those in config{{__REQUIRE__}}.js)
    //

    // @codekit-prepend "__utils.cookies.js"




    //
    // INIT ------------------------------------------------------------------------------
    //

    // Feature detection
    // If not on mobile (touch-devices), add 'no-touch' class
    if(!Utils.client.isTouch) $('html').addClass('no-touch');












    // http://www.html5rocks.com/en/tutorials/speed/unnecessary-paints/

    //console.log($);
    //console.log(Backbone);
    //console.log(_);

});