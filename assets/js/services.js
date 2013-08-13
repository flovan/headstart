var Services = function()
{
	var me					= this;
	
	//
	// VARS ----------------------------------------------------------------------
	//
	
	var routes				= {},
		dispatcher			= null;
	
	//
	// CONSTRUCTOR ---------------------------------------------------------------
	//
	
	function init()
	{
		// routes.demoRoute = 'some/demoroute/to/script'
		
		dispatcher = $('<form></form>',{ action: './', method: 'post' }); // this could probably be anything
	}
	
	//
	// PRIVATE FUNCTIONS ---------------------------------------------------------
	//
	
	function _ajax(options)
	{
		// scope vars
		var req,
			hangTO,
			cancelTO,
			defaults = {
				method: 'POST',
				cancellable: false
			};
			
		// extend with params	
		$.extend(options, defaults);
		
		// cancel if no route is set
		if(!options.route || options.route == '') return false;
		
		// if cancellable set timouts
		if(options.cancellable)
		{
			hangTO = setTimeout(function()
			{
				dispatcher.trigger('ServiceHang', {message: 'The server is taking longer than expected for route "' + options.route + '"'});
				
			}, CONFIG.serviceHangWait);
			
			cancelTO = setTimeout(function()
			{
				if(req) req.abort();
				
				dispatcher.trigger('ServiceCancel', {message: 'The server is not responding, cancelling action for route ' + options.route + '"'});
				
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
			
			if(data.error && Utils.isFunction(options.error)) options.error(data);
			else if(Utils.isFunction(options.done)) options.done(data);
			
		}).fail(function(data)
		{
			if(hangTO) clearTimeout(hangTO);
			if(cancelTO) clearTimeout(cancelTO);
			hangTO = cancelTO = null;
			
			if(Utils.isFunction(options.fail)) options.fail(data);
			else
			{
				log('Ajax fail from route "' + options.route + '"', data);
				//dispatcher.trigger('AjaxError', {message: 'WARNING.....WARNING.....', data: data});
			}
		});
	}
	
	//
	// PUBLIC FUNCTIONS ----------------------------------------------------------
	//
	
	return {
		init: init,
		
		getDispatcher: function(){ return dispatcher; },
		
		//	demoFunction: function(options)
		//	{
		//		options.route = routes.demoRoute;
		//		_ajax(options);
		//	}
	}
}();

Services.init();