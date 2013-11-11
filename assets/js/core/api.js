// API class ------------------------------------------------------------------
//
// A wrapper class for making $.ajax() calls

var API = function()
{
	var me					= this;
	
	// PRIVATE FUNCTIONS ------------------------------------------------------
	
	function _ajax(options)
	{
		var req,
			hangTO,
			cancelTO;
		
		// if cancellable set timouts
		// configureable through config.js
		if(options.cancellable)
		{
			hangTO = setTimeout(function()
			{
				App.dispatcher.trigger(EVENTS.api.apiHang, { route: options.route });
				
			}, CONFIG.serviceHangWait);
			
			cancelTO = setTimeout(function()
			{
				if(req) req.abort();
				
				App.dispatcher.trigger(EVENTS.api.apiCancel, { route: options.route });
				
			}, CONFIG.serviceCancelWait);
		}
		
		// make the ajax call
		req = $.ajax(
		{
			type: 	options.method,
			url: 	options.route,
			data:	options.values,
		}).done(function(data)
		{
			if(hangTO) clearTimeout(hangTO);
			if(cancelTO) clearTimeout(cancelTO);
			hangTO = cancelTO = null;
			
			if(_.isFunction(options.done)) options.done(data);
			else log('Route ' + options.route + ' received a result, but no callback was supplied', data);
			
		}).fail(function(data)
		{
			if(hangTO) clearTimeout(hangTO);
			if(cancelTO) clearTimeout(cancelTO);
			hangTO = cancelTO = null;
			
			if(_.isFunction(options.fail)) options.fail(data);
			else log('Route ' + options.route + ' failed, but no callback was supplied', data);
		});
	}
	
	// PUBLIC FUNCTIONS -------------------------------------------------------

	// call()
	//
	// Make a call to a route
	//
	// @route	String value from the API.routes object
	// @args	Object with following key options:
	//
	//			@done			Callback fct, called when a result is returned
	//			@fail			Callback fct, called on route failure
	//			@method			Defaults to 'POST'
	//			@cancellable	Enfore timelimits to call, defaults to false

	function call(route, args)
	{
		// Invert route key/value pairs to see if the route exists
		// TODO: Check performance of this
		if(!_.isString(_.invert(API.routes)[route]))
		{
			log('_API call failed_ on route ' + route);
			return;
		}

		// Extend default settings object
		$.extend({ method: 'POST', cancellable: false }, options);

		args.route = route;
		_ajax(arg);
	}
	
	return {
		routes: {
			// demoRoute: '/your/api/route'
		},
		call: call
	}
}();