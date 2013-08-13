//
// GENERAL UTILITIES
//

// Avoid `console` errors in browsers that lack a console. */

(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Override console.log() with log() and support for dev flag */

var log = function()
{
	if(CONFIG.devFlag) console.log.apply(console, arguments);
};

// Make a function that spits our a json object from form data

$.fn.serializeObject = function()
{
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

//
// GLOBAL UTILS
//

var Utils = function()
{
	return {
	
		// Browser sniffing
			
		detectUserAgent: function()
		{
			var b = document.documentElement;
		  	b.setAttribute('data-useragent',  navigator.userAgent);
		  	b.setAttribute('data-platform', navigator.platform );
		},
		
		// Callback Debouncing
		
		debounceFct: function(callback, wait)
		{
			var timeout = null;
		
			return function()
			{
				var obj = this, args = arguments;
		
				var delayed = function()
				{
					callback.apply(obj, args);
					timeout = null;
				};
		
				if(timeout) clearTimeout(timeout);
				timeout = setTimeout(delayed, wait);
			};
		},
				
		// Callback throttling
		
		throttleFct: function(callback, wait)
		{
			var lastTimeCalled = new Date().getTime() - wait;
		
			return function()
			{
				var obj  = this,
					args = arguments,
					now  = new Date().getTime(),
					diff = now - lastTimeCalled;
		
				if(diff > wait)
				{
					lastTimeCalled = now;
					callback.apply(obj, args);
				}
			};
		},
		
		// Debounce-able resize event
		
		resize: function(callback, debounce)
		{
			var wait = 75;
			
			if(debounce == null || debounce == undefined) debounce = false;
			
		    function resizeFct()
		    {
		        var width  = document.documentElement.clientWidth,
		            height = document.documentElement.clientHeight;
		
		        callback(width, height);
		    }
		
		    if(window.attachEvent) window.attachEvent('onresize', debounce ? Utils.debounceFct(resizeFct, wait) : resizeFct);
		    if(window.addEventListener) window.addEventListener('resize', debounce ? Utils.debounceFct(resizeFct, wait) : resizeFct, false);
		    if(window.orientationchange) window.addEventListener('orientationchange', debounce ? Utils.debounceFct(resizeFct, wait) : resizeFct, false);
		
		    resizeFct();
		},
		
		// Debounce-able scroll event
		
		scroll: function(callback, debounce)
		{
			var wait = 75,
				isTouch = !(document.documentElement.className.indexOf('no-touch') > -1);
			
			if(debounce == null || debounce == undefined) debounce = false;
			
		    function scrollFct()
		    {
		        var width  = document.documentElement.clientWidth,
		            height = document.documentElement.clientHeight,
		            st;
		        
		        if(typeof pageYOffset!= 'undefined') st = pageYOffset;
		        else
		        {
		            var B = document.body; //IE 'quirks'
		            var D = document.documentElement; //IE with doctype
		            D = (D.clientHeight)? D: B;
		            st = D.scrollTop;
		        }
		
		        callback(width, height, st);
		    }
		    
		    if(window.attachEvent)
		    {
		    	if(!isTouch) window.attachEvent('onscroll', debounce ? debounceFct(scrollFct, wait) : scrollFct);
		    	else window.attachEvent('ontouchmove', debounce ? debounceFct(scrollFct, wait) : scrollFct);
		    }
		    
		    if(window.addEventListener)
		    {
		    	log('window eventlistener', isTouch);
		    	if(!isTouch) document.addEventListener('scroll', debounce ? debounceFct(scrollFct, wait) : scrollFct, false);
		    	else document.addEventListener('touchmove', debounce ? debounceFct(scrollFct, wait) : scrollFct, false);
		    }	
		    
		    scrollFct();
		}
	}
}();