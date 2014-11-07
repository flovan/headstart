'use strict';

exports = module.exports = function(flags) {
	console.log('passed in flags');
	return {
		cwd:                 process.cwd(),
		tmpFolder:           '.tmp',
		stdoutBuffer:        [],
		lrStarted:           false,
		isProduction:        ( flags.production || flags.p ) || false,
		isServe:             ( flags.serve || flags.s ) || false,
		isOpen:              ( flags.open || flags.o ) || false,
		isEdit:              ( flags.edit || flags.e ) || false,
		isVerbose:           flags.verbose || false,
		isTunnel:            ( flags.tunnel || flags.t ) || false,
		tunnelUrl:           null,
		isPSI:               flags.psi || false,
		config:              null,
		bar:                 null
	};
};