$(document).ready(function()
{
	//
	// CORE UTILS ------------------------------------------------------------------------
	//
	// Note: If you're not using CodeKit to include snippets, you can
	// prepend snippets with Grunt, some other build script/suite
	// or copy/paste it manually
	//
	// Important: __utils.js sets up a global namespace for all utilities
	// Add this snippet before adding any other utilities
	//

	// @codekit-prepend "__utils.js"
	// @codekit-prepend "__utils.clientdetection.js"
	// @codekit-prepend "__utils.cookies.js"




	//
	// INIT ------------------------------------------------------------------------------
	//

	// Feature detection
	// If not on mobile (touch-devices), add 'no-touch' class
	if(!Utils.client.isTouch) $('html').addClass('no-hover');

});