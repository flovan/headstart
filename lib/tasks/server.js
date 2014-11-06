'use strict';

// REQUIRES -------------------------------------------------------------------

var
	_                   = require('lodash'),
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
							config: path.join(__dirname, 'package.json')
						}),
	browserSync         = require('browser-sync'),
	utils               = require('./lib/utils')
;

gulp.task('server', ['browsersync'], function (cb) {
	
	verbose(chalk.grey('Running task "server"'));
	console.log(chalk.grey('Watching files...'));

	gulp.watch(['assets/sass/**/*.{scss, sass, css}', '!assets/sass/*ie.{scss, sass, css}'], ['sass-main']);
	gulp.watch(['assets/js/**/view-*.js'], ['scripts-view', 'templates']);
	gulp.watch(['assets/js/**/*.js', '!**/view-*.js'], ['scripts-main', 'templates']);
	gulp.watch(['assets/images/**/*'], ['images']);
	gulp.watch(['templates/**/*'], ['templates']);

	cb(null);
});

gulp.task('browsersync', function (cb) {
	
	verbose(chalk.grey('Running task "browsersync"'));
	console.log(chalk.grey('Launching server...'));

	// Grab the event emitter and add some listeners
	var evt = browserSync.emitter;
	evt.on('init', bsInitHandler);
	evt.on('service:running', bsRunningHandler);

	// Serve files and connect browsers
	browserSync.init(null, {
		server:         _.isUndefined(config.proxy) ? {
							baseDir: config.export_templates
						} : false,
		logConnections: false,
		logLevel:       'silent', // 'debug'
		browser:        config.browser || 'default',
		open:           isOpen,
		port:           config.port || 3000,
		proxy:          config.proxy || false,
		tunnel:         isTunnel || null
	}, function (err, data) {

		// Use this callback to catch errors, which aren't transmitted
		// through `init`
		if (err !== null) {
			console.log(
				chalk.red('✘  Setting up a local server failed... Please try again. Aborting.\n') +
				chalk.red(err)
			);
			process.exit(0);
		}

		cb(null);
	});
});