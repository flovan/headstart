// JSHint pointers
/* global log: false */
/* global EVENTS: false */
/* global _: false */
/* global App: false */

/** @namespace A wrapper class for making Ajax calls */
var Api = (function() {

	'use strict';
	
	// PRIVATE FUNCTIONS ------------------------------------------------------
	
	function _ajax(options) {

		var req,
			hangTO,
			cancelTO;
		
		// If cancellable set timouts
		// configureable through config.js
		if(options.timed) {

			hangTO = setTimeout(function() {

				// Let observers know the call is hanging
				App.dispatcher.trigger(EVENTS.api.apiHang, { route: options.route });
				
			}, options.hang);
			
			cancelTO = setTimeout(function() {

				// Abort the call
				if(req) req.abort();
				// Let observers know the call was cancelled
				App.dispatcher.trigger(EVENTS.api.apiCancel, { route: options.route });
				
			}, options.cancel);
		}
		
		// make the ajax call
		req = $.ajax({
			type:	options.method,
			url:	options.route,
			data:	options.values,
		}).done(function(data) {

			// Clear timeouts if there are any
			if(hangTO) clearTimeout(hangTO);
			if(cancelTO) clearTimeout(cancelTO);
			hangTO = cancelTO = null;
			
			// Handle response
			if(_.isFunction(options.done)) options.done(data);
			else log('Route ' + options.route + ' received a result, but no callback was supplied', data);
			
		}).fail(function(data) {

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

	/**
	 * Make a call to a route.
	 * @param  {String} route String value from the API.routes object.
	 * @param  {Object} args Function options
	 * @param  {Object} args.values The data object that you want to pass to the call
	 * @param  {Function} [args.done] Callback fct, called when a result is returned.
	 * @param  {Function} [args.fail] Callback fct, called on route failure.
	 * @param  {String} [args.method='POST'] Method of the call.
	 * @param  {Boolean} [args.timed=false] Enforce timelimits to call, defaults to false
	 * @param  {Boolean} [args.hang=5000] Amount of milisecons to wait before declaring a call to be "hanging", defaults to 5000
	 * @param  {Boolean} [args.cancel=10000] Amount of milisecons to wait before declaring a call to be "cancelled", defaults to 10000
	 */
	function call(route, args)
	{
		// Extend default settings object
		args = $.extend({}, {
			method:	'POST',
			timed:	false,
			hang:	5000,
			cancel:	10000
		}, args);

		args.route = route;
		_ajax(args);
	}
	
	return {
		routes: {
			// demoRoute: '/your/api/route'
		},
		call: call
	};
}());