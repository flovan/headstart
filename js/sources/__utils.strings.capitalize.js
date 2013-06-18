//
// CAPITALIZE STRINGS ----------------------------------------------------------------
//
// Utility method to capitalize the first word (default),
// all words or all characters in a string
//

Utils.capitalizeString = function(string, type)
{
	if(typeof type === 'string' && type === 'each-word') return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	if(typeof type === 'string' && type === 'all-chars') return string.toUpperCase();

	return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
};