/*
 * Copyright (c) 2013 Shane Carr
 *
 * https://github.com/vote539/placeholdr
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($, ns, placeholderAttribute, origValFn){
	// Utility functions
	var putPlaceholder = function(){
		var $this = $(this);
		if (!$this[origValFn]()) {
			$this.addClass(ns);
			if ($this.attr("type") === "password") {
				$this.attr("type", "text");
				$this.data(ns+"-pwd", true);
			}
			$this[origValFn]($this.attr(placeholderAttribute));
		}
	};
	var clearPlaceholder = function(){
		var $this = $(this);
		$this.removeClass(ns);
		if ($this.data(ns+"-pwd")) {
			$this.attr("type", "password");
		}
		if ($this[origValFn]() === $this.attr(placeholderAttribute)){
			$this[origValFn]("");
		}
	};
	var clearPlaceholdersInForm = function(){
		$(this).find("["+placeholderAttribute+"]").each(function() {
			if ($(this).data(ns)) clearPlaceholder.call(this);
		});
	};

	$.fn.placeholdr = function(){
		// Don't evaluate the polyfill if the browser supports placeholders
		if (placeholderAttribute in document.createElement("input")) return;

		// Find and iterate through all inputs that have a placeholder attribute
		$(this).find("["+placeholderAttribute+"]").each(function(){
			var $this = $(this);

			// leave now if we've polyfilled this element before
			if ($this.data(ns)) return;
			$this.data(ns, true);

			// put the placeholder into the value
			putPlaceholder.call(this);

			// handle focus and blur events
			$this.focus(clearPlaceholder);
			$this.blur(putPlaceholder);
		});

		// Find and iterate through all form elements in order to prevent
		// placeholders from being submitted in forms.
		$(this).find("form").each(function(){
			var $this = $(this);

			// leave now if we've polyfilled this element before
			if ($this.data(ns)) return;
			$this.data(ns, true);

			$this.submit(clearPlaceholdersInForm);
		});
	};

	// Overwrite the existing jQuery val() function
	$.fn[origValFn] = $.fn.val;
	$.fn.val = function(txt){
		var $this = $(this);
		if ($.type(txt) === "undefined"
		 && $this.data(ns)
		 && $this[origValFn]() === $this.attr(placeholderAttribute)
		 ){
			return "";
		}
		if ($.type(txt) === "string") {
			clearPlaceholder.call(this);
		}
		return $.fn[origValFn].apply(this, arguments);
	};

	// Evaluate the script on page ready
	$(function(){
		$(document).placeholdr();
	});

	// Add default CSS rule
	document.write("<style>.placeholdr{color:#AAA;}</style>");
})(jQuery, "placeholdr", "placeholder", "placeholdrVal");