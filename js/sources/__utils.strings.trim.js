//
// TRIM STRINGS ----------------------------------------------------------------------
//
// Destructive utility method to trim a string based on a given number
// of characters and adding ellipsis (...) to the end of it
//
// Use as a fallback method for trimming multiline text
// Note: Webkit browsers & Safari support CSS line-clamping for this
//

Utils.trimString = function(string, maxChars)
{
	if(string.length > maxChars)
	{
		string = string.substring(0, maxChars);
		string += '...';
	}

	return string;
};