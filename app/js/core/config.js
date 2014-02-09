var Config = function()
{
	'use strict';

	return {
			
			// Following only apply to "cancellable" calls:
			
			// Number of ms to wait before considering a call hanging
			apiHangWait:		5000
			// Number of ms to wait before cancelling a call
		,	apiCancelWait:		10000
	};
};