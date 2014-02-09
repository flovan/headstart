// JSHint pointers
/* global log: false */
/* global EVENTS: false */
/* global _: false */
/* global App: false */

// API class ------------------------------------------------------------------
//
// A wrapper class for making $.ajax() calls

var Api = function()
{
	'use strict';
	
	// PRIVATE FUNCTIONS ------------------------------------------------------
	
	function _ajax(options)
	{
		var req,
			hangTO,
			cancelTO;
		
		// If cancellable set timouts
		// configureable through config.js
		if(options.cancellable)
		{
			hangTO = setTimeout(function()
			{
				// Let observers know the call is hanging
				App.dispatcher.trigger(EVENTS.api.apiHang, { route: options.route });
				
			}, App.config.serviceHangWait);
			
			cancelTO = setTimeout(function()
			{
				// Abort the call
				if(req) req.abort();
				// Let observers know the call was cancelled
				App.dispatcher.trigger(EVENTS.api.apiCancel, { route: options.route });
				
			}, App.config.serviceCancelWait);
		}
		
		// make the ajax call
		req = $.ajax(
		{
			type:	options.method,
			url:	options.route,
			data:	options.values,
		}).done(function(data)
		{
			// Clear timeouts if there are any
			if(hangTO) clearTimeout(hangTO);
			if(cancelTO) clearTimeout(cancelTO);
			hangTO = cancelTO = null;
			
			// Handle response
			if(_.isFunction(options.done)) options.done(data);
			else log('Route ' + options.route + ' received a result, but no callback was supplied', data);
			
		}).fail(function(data)
		{
			// Clear timeouts if there are any
			if(hangTO) clearTimeout(hangTO);
			if(cancelTO) clearTimeout(cancelTO);
			hangTO = cancelTO = null;
			
			// Handle response
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
	//			@values			The data object that you want to pass along

	function call(route, args)
	{
		// Extend default settings object
		$.extend({ method: 'POST', cancellable: false }, args);

		args.route = route;
		_ajax(args);
	}
	
	return {
		routes: {
			// demoRoute: '/your/api/route'
		},
		call: call
	};
};