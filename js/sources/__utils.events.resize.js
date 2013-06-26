//
// RESIZE EVENT ----------------------------------------------------------------------
//
// Utility method to handle debounced browser resize events
// Auto-includes an 'orientationchange'-event for mobile devices
// Auto-checks debouncing: this is handled by either Underscore/Lo-Dash
// (if included in your project) or Utils.debounce(callback, wait)
// http://responsejs.com/labs/dimensions/
//
// Dependencies: Underscore/Lo-Dash or Utils.debounce(callback, wait)
//

Utils.onWindowResize = function(callback)
{
    var debounce = typeof _ === 'function' ? _.debounce : !!Utils.debounce ? Utils.debounce : null,
        wait = 75;

    if(!debounce) console.log("ALERT: Can't find _.debounce or Utils.debounce (__utils.events.resize.js)");

	function resize()
	{
		var width  = document.documentElement.clientWidth,
			height = document.documentElement.clientHeight;

		callback(width, height);
	}

	if(window.attachEvent) window.attachEvent('onresize', debounce(resize, wait));
	if(window.addEventListener) window.addEventListener('resize', debounce(resize, wait), false);
	if(window.orientationchange) window.addEventListener('orientationchange', debounce(resize, wait), false);

    resize();
};