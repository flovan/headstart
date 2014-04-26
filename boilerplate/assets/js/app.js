// JSHint pointers
/* global Config: false */
/* global Api: false */
/* global log: false */
/* global EVENTS: false */
/* global _: false */

/** @namespace The application class will take the role of instantiating the core classes in an orderly fashion, giving greater control over dependencies. */
var App = (function() {

	'use strict';

	// VARS -------------------------------------------------------------------
	
	var	view				= null,
		dispatcher			= $({});
	
	// CONSTRUCTOR ------------------------------------------------------------
	
	var init = function(view) {

		log('_## Application initiated_');

		// Instantiate View class that is passed through init
		view = view.init();
	};
	
	// PUBLIC FUNCTIONS -------------------------------------------------------
	
	return {
		init: init,
		view: view,
		dispatcher: dispatcher,
	};
}());