var Application = function ()
{
	var me					= this;
	
	//
	// VARS ----------------------------------------------------------------------
	//
	
	var view					= null;
	
	
	//
	// CONSTRUCTOR ---------------------------------------------------------------
	//
	
	var init = function()
	{
		log('## Application init ##');
		
		_initView();
		
		log('## End Application init ##');
	};
	
	//
	// PRIVATE FUNCTIONS ---------------------------------------------------------
	//
	
	function _initView()
	{
		// Get the classname from the body tag
		var docClass = $('body').attr('class'),
			page = docClass.substr(0,docClass.indexOf('page'));
		
		// Assign correct view based on classname
		switch(page)
		{
			case 'demo': view = Demo; break;
		}
		
		// initiate the view
		view.init();
	}
	
	//
	// PUBLIC FUNCTIONS ----------------------------------------------------------
	//
	
	return {
		init: init
	};
}();

// Initiate the application on document ready
$(document).ready(Application.init);