'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define Gulp task

deps.gulp.task('build', function (cb) {
	// Load the config.json file
	utils.loadConfig(function () {
		console.log(deps.chalk.grey('Building ' + (settings.isProduction ? 'production' : 'development') + ' version...\n'));

		// Run build tasks
		deps.gulp.series(
			'clean-export',
			'sass-main',
			'scripts-main',
			'images',
			'favicons',
			'other',
			'templates',
			'manifest',
			function () {
				cli.toggleTaskSpinner(false);
				console.log(deps.chalk.green('✔  Build complete\n'));

				// Serve files if Headstart was run with the --serve flag
				if(settings.isServe) {
					deps.gulp.start('server');
				}
				
				cb(null);
			}
		)();
	});
});