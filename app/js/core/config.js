var Config = function()
{
	return {
		// An easy flag to turn of logging completely
		devFlag:			false,
		// Number of ms to wait before the API cancels a call
		// Only applies to "cancellable" calls 
		apiHangWait:		5000,
		apiCancelWait:		10000
	};
};