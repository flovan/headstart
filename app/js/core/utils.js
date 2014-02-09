// JSHint pointers
/* global log: false */
/* global EVENTS: false */
/* global _: false */
/* global App: false */

// Utils ----------------------------------------------------------------------
//
// Utilities class

var Utils = function()
{
	'use strict';

	var isTouch			= null;

	return {

		// Check for touch event support

		isTouch: function()
		{
			if(_.isNull(isTouch)) isTouch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch);
			return isTouch;
		},

		// Function for inserting report messages
		//
		// Works well with the 'reporting' scss module
		//
		// @args	Object with following key options:
		//
		//			@target		Target selector or jQuery object
		//			@message	Text that you want to display; String or Array
		//			@type		Kind of report; Error, Success, Info or Warning
		//			@addAfter	Will inject after target if true. Default true.
		//			@addClose	Will add a close button (with bound action)
		//			@onClose	Callback that is called after closing

		insertReporting: function(args)
		{
			// Extend arguments with default options
			$.extend({
					target:		null
				,	message:	null
				,	type:		'error'
				,	addAfter:	true
				,	addClose:	false	
				,	onClose:	null
			}, args);

			// Cast target to jQuery if it isn't already
			args.target = args.target instanceof jQuery ? args.target : $(args.target);

			// Decide whether a <p> or <ul> should be used
			args.message = _.isString(args.message) ?
						'<p class="report ' + args.type + '">' + args.message + '</p>'
						:
						'<ul class="report ' + args.type + '"><li>' + args.message.join('</li><li>') + '</li></ul>';

			// Insert after or before the target element
			if(args.addAfter)
			{
				// If there is a .report, remove it first
				if(args.target.next().is('.report')) args.target.next().remove();
				// Append and update reference
				args.message = args.target.after(args.message).next();
			}
			else
			{
				// If there is a .report, remove it first
				if(args.target.prev().is('.report')) args.target.prev().remove();
				// Prepend and update reference
				args.message = args.target.before(args.message).prev();
			}

			// Optionally include a close button
			// and bind a click action
			if(args.addClose)
			{
				var cbtn = $('<button class="closebtn">&#215;</button>');
				args.message.prepend(cbtn);

				cbtn.on('click', function(e)
				{
					// Fade-out the report
					cbtn.parent().fadeOut(300, function()
					{
						// Remove it
						cbtn.parent().remove();
						// Call callback if there is one
						if(_.isFunction(args.onClose)) args.onClose();
					});
				});
			}
		}
	};
}();

// $form.serializeObject() ----------------------------------------------------
//
// Serializes a form to an object, rather than a string

$.fn.serializeObject = function()
{
	'use strict';

	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};