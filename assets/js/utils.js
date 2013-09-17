//
// GENERAL UTILITIES
//

// Override console.log() with log() and support for dev flag */
window.log = function()
{
	if(this.console && CONFIG.devFlag){
		console.log.apply(console, arguments);
		// If IE feels hurt, switch be the approach below
		// console.log( Array.prototype.slice.call(arguments) );
	}
};

// Provide forms with a function to provide a data object
// This is easier for Ajax POST requestst
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
		
		// Don't use this >:(
		// 		detectUserAgent: function()
		// 		{
		// 			var b = document.documentElement;
		// 		  	b.setAttribute('data-useragent',  navigator.userAgent);
		// 		  	b.setAttribute('data-platform', navigator.platform );
		// 		},
		
		// Callback Debouncing
		
		debounce: function(callback, wait)
		{
			var timeout = null;
			if(wait == null || wait == undefined) wait = 75;
		
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
		// Limit a function from being continuusly 
		
		throttle: function(callback, wait)
		{
			var lastTimeCalled = new Date().getTime() - wait;
			if(wait == null || wait == undefined) wait = 75;
		
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
		
		resize: function(callback, wait)
		{
			if(wait == null || wait == undefined) wait = 75;
			
		    function resizeFct()
		    {
		        var width  = document.documentElement.clientWidth,
		            height = document.documentElement.clientHeight;
		
		        callback(width, height);
		    }
		
		    if(window.attachEvent) window.attachEvent('onresize', (wait != 0) ? Utils.debounceFct(resizeFct, wait) : resizeFct);
		    if(window.addEventListener) window.addEventListener('resize', (wait != 0) ? Utils.debounceFct(resizeFct, wait) : resizeFct, false);
		    if(window.orientationchange) window.addEventListener('orientationchange', (wait != 0) ? Utils.debounceFct(resizeFct, wait) : resizeFct, false);
		
		    resizeFct();
		},
		
		// Debounce-able scroll event
		
		scroll: function(callback, wait)
		{
			var isTouch = !(document.documentElement.className.indexOf('no-touch') > -1);
			if(wait == null || wait == undefined) wait = 75;
			
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
		
			/* TODO:
			**
			
			Check if Android devices do a better job at dispatching scroll events than iOS devices.
			
			*/
		    
		    if(window.attachEvent)
		    {
		    	if(!isTouch) window.attachEvent('onscroll', (wait != 0) ? debounceFct(scrollFct, wait) : scrollFct);
		    	else window.attachEvent('ontouchmove', (wait != 0) ? debounceFct(scrollFct, wait) : scrollFct);
		    }
		    
		    if(window.addEventListener)
		    {
		    	log('window eventlistener', isTouch);
		    	if(!isTouch) document.addEventListener('scroll', (wait != 0) ? debounceFct(scrollFct, wait) : scrollFct, false);
		    	else document.addEventListener('touchmove', (wait != 0) ? debounceFct(scrollFct, wait) : scrollFct, false);
		    }	
		    
		    scrollFct();
		},

		// Function to hide child image and add to bg of selector

		imgToParentBG: function(imgs)
		{
			log('Rounding images');
			
			imgs = typeof imgs == 'String' ? $(imgs) : imgs;
			imgs.each(function(i, item)
			{
				var trg = $(item);
				trg.css('visibility', 'hidden')
					.parent().css({ 'background-image': 'url(' + trg.attr('src') + ')'});
			});
		},

		// Function to check if variable is type Function

		isFunction: function(obj)
		{
		 	return !!(obj && obj.constructor && obj.call && obj.apply);
		},

		// Function for inserting report messages

		insertReporting: function(target, message, type, addAfter, addClose)
		{
			if(!addAfter) addAfter = true;
			if(!addClose) addClose = false;

			target = target instanceof jQuery ? target : $(target);
			message = typeof message === 'string' ? '<p class="report ' + type + '">' + message + '</p>' : '<ul class="report ' + type + '"><li>' + message.join('</li><li>') + '</li></ul>';

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
		},

		// Function to insert errors into a form

		insertFormErrors: function(form, errors)
		{
			form = form instanceof jQuery ? form : $(form);

			_.each(errors, function(value, key, list)
			{
				var field = form.find('*[name='+key+']');

				form.find('label[for*='+field.attr('id')+']').addClass('error').append('<p class="report error">' + value + '</p>');
			});
		},

		// Function to clear all errors from a form
		clearErrors: function(form)
		{
			form = form instanceof jQuery ? form : $(form);
			form.find('label.error').removeClass('error');
			form.find('.report.error').remove();
		}
	}
}();