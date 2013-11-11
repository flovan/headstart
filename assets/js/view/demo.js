// Demo view class

var Demo = function()
{
	var me						= this;
	
	// VARS -------------------------------------------------------------------
	
	// var $demoSelector			= '.demo';

	// CONSTRUCTOR ------------------------------------------------------------
	
	function init()
	{
		log('_## Demo view init_');

		me = me.Demo;

		_makeObjects();
		_addActions();

		App.dispatcher.trigger(EVENTS.app.viewLoaded , { view: me });
	};
	
	// PRIVATE FUNCTIONS ------------------------------------------------------
	
	// Convert all selector strings to jQuery objects
	function _makeObjects()
	{
		log('Make objects out of selector strings');
		
		// $demoSelector = $(demoSelector);
	}
	
	// Apply listeners to certain elements in the view
	function _addActions()
	{
		log('Adding actions');
		
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
		//, otherExamplePublicFunction: function(){ alert('I am public'); }
	};
}();

Demo.init();