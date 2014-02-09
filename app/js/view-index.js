// JSHint pointers
/* global log: false */
/* global EVENTS: false */
/* global _: false */
/* global App: false */

// view class

var View = function()
{
	'use strict';
	
	// VARS -------------------------------------------------------------------
	
	// var $demoSelector			= $('.demo');

	// CONSTRUCTOR ------------------------------------------------------------
	
	function init()
	{
		log('_## Demo view init_');

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

// This is the last page-blocking file, init the app with this view
App.init(new View());