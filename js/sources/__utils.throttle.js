//
// THROTTLE --------------------------------------------------------------------------
//
// Throttle method to limit the execution of a callback to no more than once
// in a given timeframe (granny-prove clicking a button too much in a short period)
//
// Note: if Underscore/Lo-Dash is included in your project you can use _.throttle(callback, wait)
// http://lodash.com/docs#throttle
//

Utils.throttle = function(callback, wait)
{
	var lastTimeCalled = new Date().getTime() - wait;

	return function()
	{
		var obj  = this,
			args = arguments,
			now  = new Date().getTime(),
			diff = now - lastTimeCalled;

		if(diff > wait)
		{
			lastTimeCalled = now;
			callback.apply(obj, args);
		}
	};
};