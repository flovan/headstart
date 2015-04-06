'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define variables

var c = deps.chalk;

// Define functions

function loadConfig (cb) {
	console.log(' ');
	cli.toggleTaskSpinner('Loading project configuration');

	// Try to read the .headstartrc file
	deps.fs.readFile('.headstartrc', 'utf8', function (err, data) {
		cli.toggleTaskSpinner(false);

		// If none if found, check if this is an older project before quitting
		if (err) {
			deps.fs.readFile('config.json', 'utf8', function (err, data) {
				if (err) {
					console.log(c.red('✘  Cannot find .headstartrc. `build` cancelled.'));
				} else {
					console.log(c.red('✘  This seems to be an older Headstart project. Please run `(sudo) npm install --g headstart-prev` and build again with `headstart-prev build [flags]`.'));
				}

				process.exit(0);
			});
		}

		// Try parsing the config data as JSON
		try {
			settings.config = JSON.parse(data);
		} catch (err) {
			console.log(c.red('✘  The configuration file is not valid json. `build` cancelled.'), err);
			process.exit(0);
		}

		// Override prefix settings
		if (deps.lodash.isArray(settings.config.prefixBrowsers) && settings.config.prefixBrowsers.length) {
			settings.prefixBrowsers = settings.config.prefixBrowsers || settings.prefixBrowsers;
		}

		// Allow customization of gulp-htmlmin through `config.json`
		settings.htmlminOptions = deps.lodash.assign({}, settings.htmlminOptions, settings.config.htmlminOptions || {});

		// Allow customization of gulp-minify-css through `config.json`
		settings.cssMinifyOptions = deps.lodash.assign({}, settings.cssMinifyOptions, settings.config.cssMinifyOptions || {});

		// Allow customization of the assets folder name
		settings.assetsFolder = settings.config.assetsFolder || settings.assetsFolder;

		// Modify or add some extra values to the config
		// to shorten future usage
		settings.config.exportAssetsImages = settings.config.exportAssets + '/' + settings.assetsFolder + '/' + settings.imgFolder;
		settings.config.exportAssetsJs = settings.config.exportAssets + '/' + settings.assetsFolder + '/' + settings.jsFolder;
		settings.config.exportAssetsCss = settings.config.exportAssets  + '/'+ settings.assetsFolder + '/' + settings.cssFolder;

		cb();
	})
}

// Define tasks

deps.taker.task('build', function (cb) {
	var start = process.hrtime();

	// Load the config.json file
	loadConfig(function () {
		// Run build tasks
		deps.taker.series(
			'clean-export',
			'styles',
			'scripts',
			// 'images',
			// 'favicons',
			// 'other',
			// 'templates',
			// 'manifest',
			function () {
				cli.toggleTaskSpinner(false);
				console.log('\n' + c.green('✔  Build complete (' + deps.prettyhr(process.hrtime(start)) + ')\n'));

				// Serve files if Headstart was run with the --serve flag
				if(settings.isServe) {
					deps.taker.series('server');
				}

				cb();
			}
		)();
	});
});
