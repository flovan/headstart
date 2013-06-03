//
// COOKIES ---------------------------------------------------------------------------
//
// Add methods for setting, getting & deleting cookies
// http://www.quirksmode.org/js/cookies.html
//

// Set cookie by key
// Optional: expire date (int days)
Utils.setCookie = function(key, value, days)
{
	var d, e = '';

	if(days)
	{
		d = new Date();
		d.setTime(d.getTime() + (days*24*60*60*1000));
		e = '; expires='+ d.toGMTString();
	}

	document.cookie = key +'='+ value + e +'; path=/';
};


// Get cookie by key
Utils.getCookie = function(key)
{
	var n = key + '=',
		v = document.cookie.split(';'),
		i = v.length;

	while(i--)
	{
		var c = v[i];
		while(c.charAt(0) === '') c = c.substring(1, c.length);
		if(c.indexOf(n) === 0) return c.substring(n.length, c.length);
	}

	return null;
};


// Delete cookies by setting the day to -1
Utils.deleteCookie = function(key)
{
	Utils.setCookie(key, '', -1);
};