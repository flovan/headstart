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
	
	var		config				= null
		,	api					= null
		,	view				= null
		,	dispatcher			= $({});
	
	// CONSTRUCTOR ------------------------------------------------------------
	
	var init = function(view) {

		log('_## Application initiated_');

		if(Utils.isOldie()) patchIE();

		// Instantiate Core files
		config = new Config();
		api = new Api();

		// Instantiate View class that is passed through init
		view = view.init();
	};

	// PRIVATE FUNCTIONS ------------------------------------------------------

	function patchIE() {

		// Load and include the js patches
		var script = document.createElement('script');
		script.onreadystatechange = function() {

			if (script.readyState === 'loaded') {
				document.body.appendChild(script);
			}
		};

		script.src = 'js/ie.min.js';

		// Load and include the css patches
		if (document.createStyleSheet) {
			document.createStyleSheet('css/ie.min.css');
		} else {
			$('<link rel="stylesheet" type="text/css" href="css/ie.min.css" />').appendTo('head');
		}
	}
	
	// PUBLIC FUNCTIONS -------------------------------------------------------
	
	return {
		init: init,
		config: config,
		api: api,
		dispatcher: dispatcher,
	};
}());