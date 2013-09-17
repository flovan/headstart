var Demo = function()
{

	var me							= this;
	
	//
	// VARS ----------------------------------------------------------------------
	//
	
	// var $demoSelector			= 'div.demo';

	//
	// CONSTRUCTOR ---------------------------------------------------------------
	//
	
	function init()
	{
		log('# Demo page init #');
		
		_makeObjects();
		_addActions();
		
		log('# End Demo page init #');
	};
	
	//
	// PRIVATE FUNCTIONS ---------------------------------------------------------
	//
	
	// Initiate some elements
	// Put all jQuery selectors inside of a var for cleaner coding
	function _makeObjects()
	{
		log('Make objects out of selector strings');
		
		// $demoSelector = $(demoSelector);
	}
	
	// Apply listeners to certain elements in the view
	function _addActions()
	{
		log('Adding actions');
		
		
	}
	
	//
	// PUBLIC FUNCTIONS ----------------------------------------------------------
	//
	
	return {
		init: init
		//, otherExamplePublicFunction: function(){ alert('I am public'); }
	};
}();