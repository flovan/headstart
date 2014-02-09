// JSHint pointers
/* global Config: false */
/* global Api: false */
/* global log: false */
/* global EVENTS: false */
/* global _: false */

// App class ------------------------------------------------------------------
//
// The application class will take the role of instatiating the core classes
// in an orderly fashion, giving greater control over dependencies.

var App = (function() {

	'use strict';

	// VARS -------------------------------------------------------------------
	
	var		config				= null
		,	api					= null
		,	view				= null
		,	dispatcher			= $({});
	
	// CONSTRUCTOR ------------------------------------------------------------
	
	var init = function(view) {

		log('_## Application initiated_');

		// Instantiate Core files
		config = new Config();
		api = new Api();

		// Instantiate View class that is passed through init
		view = view.init();
	};

	// PRIVATE FUNCTIONS ------------------------------------------------------


	
	// PUBLIC FUNCTIONS -------------------------------------------------------


	
	return {
			init: init
		,	config: config
		,	api: api
		,	dispatcher: dispatcher
	};
}());