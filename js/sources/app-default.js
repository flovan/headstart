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
	// If Underscore/Lo-Dash is included in your project
	// you can use _.debounce(callback, wait) instead
	//

	// @codekit-prepend "__utils.js"
	// @codekit-prepend "__utils.clientdetection.js"
	// @codekit-prepend "__utils.cookies.js"
	// @codekit-prepend "__utils.debounce.js"




	//
	// INIT ------------------------------------------------------------------------------
	//

	// Feature detection
    // If not on mobile (touch-devices), add 'no-touch' class to the HTML-tag
    // Note: you don't need a DOM library for that (it's even faster without one)
    // http://remysharp.com/2013/04/19/i-know-jquery-now-what
    if(!Utils.client.isTouch) document.documentElement.className = 'no-touch';

});