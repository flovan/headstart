//
// DEBOUNCE --------------------------------------------------------------------------
//
// Debounce method to guarantee that a callback method will only ever
// be executed once in a given timeframe (<-> browser resize event in IE which fires continuously)
// http://davidwalsh.name/function-debounce
//
// Note: if Underscore/Lo-Dash is included in your project you can use _.debounce(callback, wait)
// http://lodash.com/docs#debounce
//

Utils.debounce = function(callback, wait)
{
	var timeout = null;

	return function()
	{
		var obj = this, args = arguments;

		var delayed = function()
		{
			callback.apply(obj, args);
			timeout = null;
		};

		if(timeout) clearTimeout(timeout);
		timeout = setTimeout(delayed, wait);
	};
};