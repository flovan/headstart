// Utils ----------------------------------------------------------------------
//
// Utilities class

var Utils = function()
{
	var isTouch			= null;

	return {

		// Check for touch event support

		isTouch: function()
		{
			if(_.isNull(isTouch)) isTouch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch);
			return isTouch;
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
	};
}();

// $form.serializeObject() ----------------------------------------------------
//
// Serializes a form to an object, rather than a string

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