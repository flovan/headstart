'use strict';

var
	deps       = require('./dependencies'),
	cli        = require('./cli'),
	settings   = require('./settings'),

	c          = deps.chalk
;

// Set exports
exports = module.exports = {
	// // Validate a repository and map it to the settings module
	// validateRepo: function (repoString) {
	// 	// Check for a slash
	// 	if (repoString.) {
	// 		return c.red('Expecting `username/repository` or `user/repo#tag. (Hit backspace to continue)');
	// 	}
	// 	// Set the setting git object and confirm validity
	// 	return true;
	// }

	// // Handle change events for Gulp watch instances
	//
	// watchHandler: function (e) {
	// 	console.log(c.grey('"' + e.path.split('/').pop() + '" was ' + e.type));
	// },
	//
	// // BrowserSync `init` event handler
	//
	// bsInitHandler: function (data) {
	// 	// Store started state globally
	// 	settings.lrStarted = true;
	//
	// 	// Show some logs
	// 	console.log(c.cyan('🌐  Local access at'), c.magenta(data.options.urls.local));
	// 	console.log(c.cyan('🌐  Network access at'), c.magenta(data.options.urls.external));
	// },
	//
	// // BrowserSync `service:running` event handler
	//
	// bsRunningHandler: function (data) {
	// 	if (data.tunnel) {
	// 		settings.tunnelUrl = data.tunnel;
	// 		console.log(c.cyan('🌐  Public access at'), c.magenta(tunnelUrl));
	//
	// 		if (settings.isPSI) {
	// 			deps.gulp.start('psi');
	// 		}
	// 	} else if (settings.isPSI) {
	// 		console.log(c.red('✘  Running PSI cannot be started without a tunnel. Please restart Headstart with the `--tunnel` or `t` flag.'));
	// 	}
	// }
};
