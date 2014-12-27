'use strict';

// Require modules
// ----------------------------------------------------------------------------

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	settings            = require('../settings')
;

// Define Gulp task
// ----------------------------------------------------------------------------

deps.gulp.task('server', ['browsersync'], function (cb) {
	
	utils.verbose(deps.chalk.grey('Running task "server"'));
	console.log(deps.chalk.grey('Watching files...'));

	deps.gulp.watch([settings.assetsFolder + '/sass/**/*.{scss, sass, css}', '!assets/sass/*ie.{scss, sass, css}'], ['sass-main']).on('change', utils.watchHandler);
	deps.gulp.watch([settings.assetsFolder + '/js/**/view-*.js'], ['scripts-view', 'templates']).on('change', utils.watchHandler);
	deps.gulp.watch([settings.assetsFolder + '/js/**/*.js', '!**/view-*.js'], ['scripts-main', 'templates']).on('change', utils.watchHandler);
	deps.gulp.watch([settings.assetsFolder + '/images/**/*'], ['images']).on('change', utils.watchHandler);
	deps.gulp.watch(['templates/**/*'], ['templates']).on('change', utils.watchHandler);

	cb(null);
});

deps.gulp.task('browsersync', function (cb) {
	
	utils.verbose(deps.chalk.grey('Running task "browsersync"'));
	console.log(deps.chalk.grey('Launching server...'));

	// Grab the event emitter and add some listeners
	var evt = deps.browserSync.emitter;
	evt.on('init', utils.bsInitHandler);
	evt.on('service:running', utils.bsRunningHandler);

	// Serve files and connect browsers
	deps.browserSync.init(null, {
		server:         deps.lodash.isUndefined(settings.config.proxy) ? {
							baseDir: settings.config.exportTemplates
						} : false,
		logConnections: false,
		logLevel:       'silent', // 'debug'
		browser:        settings.config.browser || 'default',
		open:           settings.isOpen,
		port:           settings.config.port || 3000,
		proxy:          settings.config.proxy || false,
		tunnel:         settings.isTunnel || null
	}, function (err, data) {

		// Use this callback to catch errors, which aren't transmitted
		// through `init`
		if (err !== null) {
			console.log(
				deps.chalk.red('✘  Setting up a local server failed... Please try again. Aborting.\n') +
				deps.chalk.red(err)
			);
			process.exit(0);
		}

		cb(null);
	});
});