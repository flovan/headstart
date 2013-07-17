

/* Avoid `console` errors in browsers that lack a console. */
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

/* Override console.log() with log() and support for dev flag */
var log = function()
{
	if(app.devFlag) console.log.apply(console, arguments);
};

/* ************************************************************************** */

/* Application code */

var Application = function ()
{
	var me					= this;
	
	//
	
	me.doc 					= { width: 0, height: 0 };
	
	/* PRIVATE UTIL FUNCTIONS ----------------------------------------------- */
	
	/* Browser sniffing */	
	
	var detectUserAgent = function()
	{
		var b = document.documentElement;
	  	b.setAttribute('data-useragent',  navigator.userAgent);
	  	b.setAttribute('data-platform', navigator.platform );
	};
	
	/* Callback Debouncing */

	var debounceFct = function(callback, wait)
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
	};
	
	/* Callback throttling */

	var throttleFct = function(callback, wait)
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
	};
	
	/* Debounce-able resize event */
	
	var resize = function(callback, debounce)
	{
		var wait = 75;
		
		if(debounce == null || debounce == undefined) debounce = false;
		
	    function resizeFct()
	    {
	        var width  = document.documentElement.clientWidth,
	            height = document.documentElement.clientHeight;
	
	        callback(width, height);
	    }
	
	    if(window.attachEvent) window.attachEvent('onresize', debounce ? debounceFct(resizeFct, wait) : resizeFct);
	    if(window.addEventListener) window.addEventListener('resize', debounce ? debounceFct(resizeFct, wait) : resizeFct, false);
	    if(window.orientationchange) window.addEventListener('orientationchange', debounce ? debounceFct(resizeFct, wait) : resizeFct, false);
	
	    resizeFct();
	};
	
	/* Debounce-able resize event */
	
	var scroll = function(callback, debounce)
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
	};
	
	/* APP FUNCTIONS -------------------------------------------------------- */
	
	// -> Custom code here
	
	/* PUBLIC FUNCTIONS ----------------------------------------------------- */
	
	return {
				initiate: function()
				{
					// Call specific function per page
					// - Modernizr puts classes on <html>, so other option is <body>
					// - Usage example: <body class="homepagecontent"></body>
					
					var docClass = $('body').attr('class'),
						page = !!docClass ? docClass.substr(0,docClass.indexOf('content')) : '';
											
					switch(page)
					{
						/*case 'homepage':
						
						break;*/
					}
				},
				
				devFlag: true // set to false to hide logs
			};
}

var app = new Application();
$(document).ready(app.initiate);