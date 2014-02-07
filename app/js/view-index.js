// view class

var View = function()
{
	var me						= this;
	
	// VARS -------------------------------------------------------------------
	
	// var $demoSelector			= $('.demo');

	// CONSTRUCTOR ------------------------------------------------------------
	
	function init()
	{
		log('_## Demo view init_');

		me = me.Demo;
		
		_addActions();
	}
	
	// PRIVATE FUNCTIONS ------------------------------------------------------
	
	// Apply listeners to certain elements in the view
	function _addActions()
	{
		log('~ Adding actions');
		
		// $demoSelector.on('click', _demoSelectorClickHandler);
	}







	/*function _demoSelectorClickHandler(e)
	{
		log('Clicked!');
		return false;
	}*/







	
	// PUBLIC FUNCTIONS ----------------------------------------------------------
	
	return {
		init: init
		//, examplePublicFunction: function(){ alert('I am public'); }
	};
};

// Last page-blocking file, init the app with this view

App.init(new View());