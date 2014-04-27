// JSHint pointers
/* global log: false */
/* global EVENTS: false */
/* global _: false */
/* global App: false */

/** @namespace  */
var Utils = (function() {

	'use strict';

	var isTouch		= null,
		isOldie		= null;

	// Detect IE through condifional comments.
	// Read: http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/

	/*var ie = (function() {
 
		var undef,
			v		= 3,
			div		= document.createElement('div'),
			all		= div.getElementsByTagName('i');

		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);

		return v > 4 ? v : undef;
	}());*/

	return {

		/**
		 * Detects whether a screen supports touch events.
		 * It is actually best not to use this as it isn't {@link http://www.stucox.com/blog/you-cant-detect-a-touchscreen/ cross-browser}. 
		 * @return {Boolean}
		 */
		isTouch: function() {

			if(_.isNull(isTouch)) isTouch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch);
			return isTouch;
		},

		/**
		 * Detects whether a browser is "old", i.e. less than IE 9.
		 * @return {Boolean}
		 */
		/*isOldie: function() {

			if(_.isNull(isOldie)) isOldie = ie < 9;
			return isOldie;
		},*/

		/**
		 * Injects script and style tags for older browser
		 */
		/*patchOldie: function(isProduction)
		{
			// Load and include the js patches
			var script = document.createElement('script');
			script.onreadystatechange = function() {

				if (script.readyState === 'loaded') {
					document.body.appendChild(script);
				}
			};
			script.src = 'js/ie' + (isProduction ? '.min' : '') + '.js';

			// Load and include the css patches
			if (document.createStyleSheet) {
				document.createStyleSheet('css/ie' + (isProduction ? '.min' : '') + '.css');
			} else {
				$('<link rel="stylesheet" type="text/css" href="css/ie' + (isProduction ? '.min' : '') + '.css" />').appendTo('head');
			}
			log('testlog');
		},*/

		/**
		 * Shares a url through a social service out of the defined set (Facebook, Twitter, Google+, Pinterest or LinkedIn).
		 * @param  {Sting} service The service to share onto. Can be "facebook", "twitter", "googleplus", "pinterest" or "linkedin".
		 * @param  {Object} args The options object.
		 * @param {Number} [args.width=600] The width of the pop-up window.
		 * @param {Number} [args.height=600] The height of the pop-up window.
		 * @param {String} [args.title] The title of what you want to share. Not used by Google+. Defaults to the page title.
		 * @param {String} [args.description] A description of what you want to share. Only used by Facebook. Defaults to to content of the description meta tag.
		 * @param {String} [args.link] The url that you want to share. Defaults to the page url.
		 * @param {String} [args.media] The url to an image that you want to share along with the rest. Only used by Facebook and Pinterest.
		 */
		/*share: function(service, args) {

			if(!_.isString(service)) {

				log('*Utils.share()::A service ("facebook", "twitter", ...) must be provided.*');
				return;
			}

			// Extend arguments with default options
			args = $.extend({}, {
				width:			600,
				height:			600,
				title:			document.title || 'No title provided',
				description:	($('meta[name=description]').length ? $('meta[name=description]').attr('content') : 'No description provided'),
				link:			window.location || 'No link provided',
				media:			''
			}, args);

			switch(service) {

				case 'facebook':
					window.open('//www.facebook.com/share.php?m2w&s=100&p[url]=' + encodeURIComponent(args.link) + '&p[images][0]=' + encodeURIComponent(args.media) + '&p[title]=' + encodeURIComponent(args.title) + '&p[summary]=' + encodeURIComponent(args.description),'Facebook','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + args.height + ',width=' + args.width);
				break;
				case 'twitter':
					window.open('https://twitter.com/intent/tweet?original_referer=' + encodeURIComponent(args.link) + '&text=' + encodeURIComponent(args.title) + '%20' + encodeURIComponent(args.link),'Twitter','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + args.height + ',width=' + args.width);
				break;
				case 'linkedin':
					window.open('//www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(args.link) + '&title=' + encodeURIComponent(args.title) + '&source=' + encodeURIComponent(args.link),'LinkedIn','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + args.height + ',width=' + args.width);
				break;
				case 'pinterest':
					window.open('//pinterest.com/pin/create/button/?url=' + encodeURIComponent(args.link) + '&media=' + encodeURIComponent(args.media) + '&description=' + encodeURIComponent(args.title),'Pinterest','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + args.height + ',width=' + args.width);
				break;
				case 'googleplus':
					window.open('//plus.google.com/share?url=' + encodeURIComponent(args.link),'GooglePlus','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + args.height + ',width=' + args.width);
				break;
				default:
					log('*Utils.share()::The provided service "' + service + '" is not supported.*');
				break;
			}
		}*/
	};
}());

/**
 * Serializes a form to an object, rather than a string.
 * @return {Object}
 */
/*$.fn.serializeObject = function() {

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
};*/
