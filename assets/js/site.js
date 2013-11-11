// Document -------------------------------------------------------------------

$(document).on('ready', function()
{
	log('_## Document ready_');

	//
	// VARS -------------------------------------------------------------------
	//

	//$myElement					= $('#myElement');

	//
	// ACTIONS ----------------------------------------------------------------
	//

	//	$myEmement.on('click', myElementClickHandler);

	//
	// FUNCTIONS --------------------------------------------------------------
	//

	// 	function myElementClickHandler(e)
	//	{
	//		log('Hurray I was clicked!');
	//	}
});

// Utils ----------------------------------------------------------------------
//
// Utilities class

var Utils = function()
{
	var isTouch			= null;

	return {
	
		// Browser sniffing
		
		// Don't use this >:(
		// 		detectUserAgent: function()
		// 		{
		// 			var b = document.documentElement;
		// 		  	b.setAttribute('data-useragent',  navigator.userAgent);
		// 		  	b.setAttribute('data-platform', navigator.platform );
		// 		},

		// Check for touch event support

		isTouch: function()
		{
			if(_.isNull(isTouch)) isTouch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch);
			return isTouch;
		},
		
		// Debounce-able resize event
		
		resize: function(callback, wait)
		{
			if(!_.isNumber(wait)) wait = 75;
			
		    function resizeFct()
		    {
		        var width  = document.documentElement.clientWidth,
		            height = document.documentElement.clientHeight;
		
		        callback(width, height);
		    }
		
		    if(window.attachEvent) window.attachEvent('onresize', _.debounce(resizeFct, wait));
		    if(window.addEventListener) window.addEventListener('resize', _.debounce(resizeFct, wait));
		    if(window.orientationchange) window.addEventListener('orientationchange', _.debounce(resizeFct, wait));
		
		    resizeFct();
		},
		
		// Debounce-able scroll event
		
		scroll: function(callback, wait)
		{
			if(!_.isNumber(wait)) wait = 75;
			
		    function scrollFct()
		    {
		        var width  		= document.documentElement.clientWidth,
		            height 		= document.documentElement.clientHeight;
		        
		        var body 		= document.body, //IE 'quirks'
		            doc 		= document.documentElement, //IE with doctype
		            doc 		= (doc.clientHeight)? doc : body,
		            scrollTop 	= doc.scrollTop;
		
		        callback(width, height, scrollTop);
		    }
		
			// TODO:
			// Check if Android devices do a better job at dispatching scroll events than iOS devices.
		    
		    if(window.attachEvent)
		    {
		    	if(!Utils.isTouch()) window.attachEvent('onscroll', _.throttle(scrollFct, wait));
		    	else window.attachEvent('ontouchmove', _.throttle(scrollFct, wait));
		    }
		    
		    if(window.addEventListener)
		    {
		    	if(!Utils.isTouch()) document.addEventListener('scroll', _.throttle(scrollFct, wait));
		    	else document.addEventListener('touchmove', _.throttle(scrollFct, wait), false);
		    }	
		    
		    scrollFct();
		},

		// Function for inserting report messages

		insertReporting: function(target, message, type, addAfter, addClose)
		{
			if(!_.isBoolean(addAfter)) addAfter = true;
			if(!_.isBoolean(addClose)) addClose = false;

			target = target instanceof jQuery ? target : $(target);
			message = _.isString(message) ? 
						'<p class="report ' + type + '">' + message + '</p>'
						:
						'<ul class="report ' + type + '"><li>' + message.join('</li><li>') + '</li></ul>';

			if(addAfter)
			{
				if(target.next().is('.report')) target.next().remove();
				message = target.after(message).next();
			}
			else
			{
				if(target.prev().is('.report')) target.prev().remove();
				message = target.before(message).prev();
			}

			if(addClose)
			{
				var cbtn = $('<button class="closebtn">&#215;</button>');
				message.prepend(cbtn);

				cbtn.on('click', function(e)
				{
					cbtn.parent().fadeOut(300, function(){ cbtn.parent().remove(); });
				});
			}
		}
	}
}();

// $form.serializeObject() ----------------------------------------------------
//
// Serializes a form to an object, rather than a string

/*$.fn.serializeObject = function()
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
};*/