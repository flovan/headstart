define([

	'dom',
	'underscore',
    'backbone'

], function($, _, Backbone)
{
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