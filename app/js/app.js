var App = (function()
{
	var me					= this;
	
	// VARS -------------------------------------------------------------------
	
	var config				= null,
		api					= null,
		view				= null,
		dispatcher			= $({});
	
	// CONSTRUCTOR ------------------------------------------------------------
	
	var init = function(view)
	{
		log('_## Application initiated_');

		//dispatcher.on('test', function(e, data){ log('test',data); });

		config = new Config();
		api = new Api();

		view = view.init();
	};

	// PRIVATE FUNCTIONS ------------------------------------------------------


	
	// PUBLIC FUNCTIONS -------------------------------------------------------


	
	return {
		init: init,
		config: config,
		api: api,
		dispatcher: dispatcher
	};
}());