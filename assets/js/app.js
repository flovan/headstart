var App = function ()
{
	var me					= this;
	
	// VARS -------------------------------------------------------------------
	
	var view				= null,
		dispatcher 			= $('<div />');
	
	// CONSTRUCTOR ------------------------------------------------------------
	
	var init = function()
	{
		log('_## Application init_');

		dispatcher.on(EVENTS.app.viewLoaded, _viewLoadedHandler);
	};







	// Handler of the viewLoaded event
	function _viewLoadedHandler(e, data)
	{
		log('_## View finished initializing_', data.view);
	}







	
	// PUBLIC -----------------------------------------------------------------
	
	return {
		init: init,
		dispatcher: dispatcher
	};
}();

App.init();