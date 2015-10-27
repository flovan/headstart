'use strict';

var
	deps     = require('../dependencies'),
	utils    = require('../utils'),
	cli      = require('../cli'),
	settings = require('../settings'),

	c        = deps.chalk,
	conf     = settings.config,
	bs
;

// Handle change events for Gulp watch instances
function watchLog (path, evtType) {
	var
		action = '',
		isFolder = evtType.indexOf('Dir') > -1
	;
	switch (evtType) {
		case 'add': action = 'added'; break;
		case 'change': action = 'changed'; break;
		case 'unlink': action = 'removed'; break;
		case 'addDir': action = 'added'; break;
		case 'unlinkDir': action = 'removed'; break;
	}

	console.log(c.grey(`${isFolder ? 'Directory ' : ''}"${path}" was ${action}`));
}

// Define task
deps.taker.task('serve', deps.taker.series('build', function (cb) {
	console.log(deps.chalk.grey('Launching server'));

	settings.server = deps.browserSync.create();

	// Serve files and connect browsers
	settings.server.init({
		server:         { baseDir: conf.dist.templates },
		logConnections: conf.server.logConnections,
		logLevel:       conf.server.logLevel,
		port:           conf.server.port,
		proxy:          settings.config.proxy || false,
		tunnel:         settings.isTunnel || null,
		open:           false
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

		// Get the URLS now that the server is running
		var urls = data.options.get('urls');

		// Show some logs
		console.log(`Local access at ${c.cyan(urls.get('local'))}`);
		console.log(`Network access at ${c.cyan(urls.get('external'))}`);
		console.log(`BrowserSync UI at ${urls.get('ui')}`);

		// Check if a tunnel is up
		if (data.tunnel) {
			settings.tunnelUrl = data.tunnel;
			console.log(c.cyan('Public access at'), c.magenta(tunnelUrl));
		}

		// Watch files
		deps.chok.watch('src/**/sass/**/*.{css,sass,scss}', {
			ignoreInitial: true
		}).on('all', function (evt, path) {
			watchLog(path, evt);
			deps.taker.series('sass')();
		});

		deps.chok.watch(['src/**/js/*.js', '!_*.js'], {
			ignoreInitial: true
		}).on('all', function (evt, path) {
			watchLog(path, evt);
			deps.taker.series('scripts', 'templates')();
		});

		deps.chok.watch(['src/**/img/*', '!_*.*'], {
			ignoreInitial: true
		}).on('all', function (evt, path) {
			watchLog(path, evt);
			deps.taker.series('graphics')();
		});

		deps.chok.watch([
			'./src/**/*.{html,php,hbs}',
			'!./src/common/**/*',
			'!_*.*'
		], {
			ignoreInitial: true
		}).on('all', function (evt, path) {
			watchLog(path, evt);
			deps.taker.series('templates')();
		});

		// Let the user know
		console.log(deps.chalk.grey('\nWatching files...'));

		cb();
	});
}));
