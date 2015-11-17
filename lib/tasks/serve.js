'use strict';

var deps          = require('../dependencies');
var utils         = require('../utils');
var cli           = require('../cli');
var settings      = require('../settings');

var _             = deps.lodash;
var c             = deps.chalk;
var conf          = settings.config;
var bs            = null;
var defaultAction = 'changed';
var lastRun       = null;
var baseAssetPath = 'src/common';

function lastRunDiff () {
	return Date.now() - deps.taker.lastRun('templates');
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
		open:           false,
		notify:         false
	}, function (err, data) {
		// Use this callback to catch errors that aren't transmitted
		// through `init`
		if (err !== null) {
			console.log(
				deps.chalk.red('✘  Setting up a local server failed... Aborting.\n') +
				deps.chalk.red(err)
			);
			process.exit(1);
		}

		// Get the URLS now that the server is running
		var urls = data.options.get('urls');

		// Show some logs
		console.log(`Local access at ${c.cyan(urls.get('local'))}`);
		if (urls.get('external') !== undefined) {
			// User is online
			console.log(`Network access at ${c.cyan(urls.get('external'))}`);
		}
		console.log(`BrowserSync UI at ${urls.get('ui')}`);

		// Check if a tunnel is up
		if (data.tunnel) {
			settings.tunnelUrl = data.tunnel;
			console.log(c.cyan('Public access at'), c.magenta(tunnelUrl));
		}

		// Set up a watch for all CSS, JS and template files
		deps.chok.watch([
			'src/**/sass/**/*.{css,sass,scss}',
			'src/**/js/*.js',
			'src/**/*.{html,php,hbs}',
			'!_*.{css,js,html,php,hbs}'
		], {
			ignoreInitial: true
		}).on('all', function (evt, assetPath) {
			var action    = defaultAction;
			var isDir     = evt.indexOf('Dir') > -1;
			var tasks     = [];
			var base      = deps.path.basename(assetPath);
			var ext       = deps.path.extname(assetPath);
			var parts     = assetPath.split('/');
			var isIgnored = base.indexOf('_') == 0;
			var isSass    = _.includes(parts, 'sass');
			var isJS      = _.includes(parts, 'js');

			// Don't do anything with ready
			if (evt === 'ready') {
				return;
			}

			// Output errors
			if (evt === 'error') {
				console.log(chalk.red('Somthing went wrong while watching %s'), assetPath);
				return;
			}

			// Normalize remove/add events
			if (evt.indexOf('add') === 0) {
				action = 'added';

				// We don't need to do anything for added files that will get
				// ignored later on anyway
				if (isIgnored) {
					return;
				}
			} else if (evt.indexOf('unlink') === 0) {
				action = 'removed';
			}

			// We don't need to handle changed but ignored JS files either
			if (action === defaultAction && (isJS && isIgnored)) {
				return;
			}

			// If the file isn't prefixed with a underscore, remove it,
			// replacing sass or scss by css since the cache contains the
			// final file extension
			if (action !== defaultAction && !isIgnored) {
				utils.uncacheAssetType(ext.replace(/sass|scss/, 'css'));
			}

			// Log the found event and the file that triggered it
			console.log(c.grey(`${isDir ? 'Directory ' : ''}"${assetPath}" was ${action}`));

			// If the file path contains either 'sass' or 'js'
			if (isSass || isJS) {
				// Run either the js or sass task
				deps.taker.series(isSass ? 'sass' : 'scripts', function () {
					// If we aren't just changing a file, run the  templates
					// taks to make sure we're serving the latest files
					if ((isJS || action !== defaultAction) && (lastRun === null || lastRun - lastRunDiff() > 100)) {
						deps.taker.series('templates')();
						lastRun = lastRunDiff();
					} else {
						lastRun = null;
					}
				})();

				return;
			}

			// All other files require a new template build
			deps.taker.series('templates')();
		});

		// Sync up all the other folders
		deps.chok.watch([
			`${baseAssetPath}/**/*`,
			`!${baseAssetPath}/sass`,
			`!${baseAssetPath}/sass/**/*`,
			`!${baseAssetPath}/js`,
			`!${baseAssetPath}/js/**/*`,
			`!${baseAssetPath}/ie`,
			`!${baseAssetPath}/ie/**/*`,
			'!**/_*',
			'!**/.DS_Store'
		], {
			ignoreInitial: true
		}).on('all', function (evt, assetPath) {
			var trgPath = settings.config.dist.assets + '/' + assetPath.split(baseAssetPath).pop().substring(1);

			// Don't do anything with ready
			if (evt === 'ready') {
				return;
			}

			// Output errors
			if (evt === 'error') {
				console.log(c.red(`Something went wrong while watching ${assetPath}`));
				return;
			}

			if (evt.indexOf('unlink') === 0) {
				console.log(c.grey(`"${assetPath}" was deleted`));

				// delete files from target dir
				deps.del.sync(trgPath).then(function () {
					if (settings.config.dev.reloadAlways === true) {
						settings.server.reload({ once: true });
					}
				});
			} else {
				// Reuse add event for a description
				if (evt === 'add') {
					evt = 'was added';
				}

				console.log(c.grey(`"${assetPath}" ${evt}`));

				// copy/sync files to target dir
				deps.ncp(assetPath, trgPath, function (err) {
					if (err) {
						console.log(c.red(`Something went wrong while copying ${assetPath}`));
						return;
					}

					if (settings.config.dev.reloadAlways === true) {
						settings.server.reload({ once: true });
					}
				});
			}
		});

		// Let the user know
		console.log(c.grey('\nWatching files...'));

		cb();
	});
}));
