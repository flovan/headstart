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
		open:           false,
		notify:         false
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

		deps.chok.watch([
			'src/**/sass/**/*.{css,sass,scss}',
			'src/**/js/*.js',
			'src/**/*.{html,php,hbs}',
			'!_*.{css,js,html,php,hbs}'
		], {
			ignoreInitial: true
		}).on('all', function (evt, path) {
			var
				action = 'changed',
				isDir  = evt.indexOf('Dir') > -1,
				tasks  = []
			;

			// Normalize remove/add events
			if (evt.indexOf('add') === 0) {
				action = 'added';
			} else if (evt.indexOf('unlink') === 0) {
				action = 'removed';
			}

			// Log the found event and the file that triggered it
			console.log(c.grey(`${isDir ? 'Directory ' : ''}"${path}" was ${action}`));

			if (path.indexOf('/sass') > -1) {
				deps.taker.series('sass', function () {
					if (action !== 'changed') {
						deps.taker.series('templates')();
					}
				})();

			} else if (path.indexOf('/js') > -1) {
				deps.taker.series('scripts', function () {
					if (action !== 'changed') {
						deps.taker.series('templates')();
					}
				})();
			} else {
				deps.taker.series('templates')();
			}
		});

		// Let the user know
		console.log(deps.chalk.grey('\nWatching files...'));

		cb();
	});
}));
