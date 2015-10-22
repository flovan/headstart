'use strict';

var
	deps     = require('../dependencies'),
	utils    = require('../utils'),
	cli      = require('../cli'),
	settings = require('../settings'),

	c        = deps.chalk,
	conf     = settings.config,
	bs       = deps.browserSync.create()
;

// Handle change events for Gulp watch instances
function watchHandler (e) {
	console.log(c.grey('"' + e.path.split('/').pop() + '" was ' + e.type));
}

// Define task
deps.taker.task('serve', deps.taker.series('build', function (cb) {
	console.log(deps.chalk.grey('Launching server'));

	// Serve files and connect browsers
	bs.init({
		server:         { baseDir: conf.dist.templates },
		logConnections: conf.server.logConnections,
		logLevel:       conf.server.logLevel,
		port:           conf.server.port,
		proxy:          settings.config.proxy || false,
		tunnel:         settings.isTunnel || null
	}, function (err, data) {
		// Use this callback to catch errors that aren't transmitted
		// through `init`
		if (err !== null) {
			console.log(
				deps.chalk.red('✘  Setting up a local server failed... Please try again. Aborting.\n') +
				deps.chalk.red(err)
			);
			process.exit(1);
		}

		// Store started state globally
		settings.lrStarted = true;

		// Get the URLS now that the server is running
		var urls = data.options.get('urls');

		// Show some logs
		console.log(c.cyan(`Local access at ${urls.get('local')}`));
		console.log(c.cyan(`Network access at ${urls.get('external')}`));
		console.log(c.cyan(`BrowserSync UI at ${urls.get('ui')}`));

		// Check if a tunnel is up
		if (data.tunnel) {
			settings.tunnelUrl = data.tunnel;
			console.log(c.cyan('Public access at'), c.magenta(tunnelUrl));
		}

		// Watch files
		deps.chok.watch('src/**/sass/*.{css,sass,scss}', ['sass']).on('change', watchHandler);
		deps.chok.watch(['src/**/js/*.js', '!_*.js'], ['scripts', 'templates']).on('change', watchHandler);
		deps.chok.watch(['src/**/img/*', '!_*.js'], ['graphics']).on('change', watchHandler);
		deps.chok.watch(['./src/layout/**/*.{html,php,hbs}', './src/partial/**/*.{html,php,hbs}'], ['templates']).on('change', watchHandler);

		// Let the user know
		console.log(deps.chalk.grey('\nWatching files...'));

		cb();
	});
}));
