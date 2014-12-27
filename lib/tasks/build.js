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

deps.gulp.task('build', function (cb) {

	utils.verbose(deps.chalk.grey('\nRunning task "build"'));

	// Load the config.json file
	console.log(deps.chalk.grey((settings.isVerbose ? '' : '\n') + 'Loading config.json...'));
	deps.fs.readFile('.headstartrc', 'utf8', function (err, data) {

		if (err) {
			console.log(deps.chalk.red('✘  Cannot find config.json. Have you initiated Headstart through `headstart init?'), err);
			process.exit(0);
		}

		// Try parsing the config data as JSON
		try {
			settings.config = JSON.parse(data);
		} catch (err) {
			console.log(deps.chalk.red('✘  The config.json file is not valid json. Aborting.'), err);
			process.exit(0);
		}

		// Allow customization of gulp-htmlmin through `config.json`
		settings.htmlminOptions = deps.lodash.assign({}, settings.htmlminOptions, settings.config.htmlminOptions || {});

		// Allow customization of the assets folder name through `config.json`
		settings.assetsFolder = settings.assetsFolder || settings.assetsFolder;

		// Modify or add some extra values to the config
		// to shorten future usage
		settings.config.exportAssetsImages = settings.config.exportAssets + '/' + settings.assetsFolder + '/' + settings.imgFolder;
		settings.config.exportAssetsJs = settings.config.exportAssets + '/' + settings.assetsFolder + '/' + settings.jsFolder;
		settings.config.exportAssetsCss = settings.config.exportAssets  + '/'+ settings.assetsFolder + '/' + settings.cssFolder;

		// Instantiate a progressbar when not in verbose mode
		if (!settings.isVerbose) {
			settings.bar = new deps.ProgressBar(deps.chalk.grey('Building ' + (settings.isProduction ? 'production' : 'development') + ' version [:bar] :percent done'), {
				complete:   '◊',
				incomplete: '-',
				total:      7
			});
			utils.updateBar();
		} else {
			console.log(deps.chalk.grey('Building ' + (settings.isProduction ? 'production' : 'development') + ' version...'));
		}

		// Run build tasks
		// Serve files if Headstart was run with the --serve flag
		deps.sequence(
			'clean-export',
			[
				'sass-main',
				'scripts-main',
				'images',
				'other'
			],
			'templates',
			'manifest',
			function () {
				console.log(deps.chalk.green((!settings.isProduction ? '\n' : '') + '✔  Build complete'));
				if(settings.isServe) {
					deps.gulp.start('server');
				}
				cb(null);
			}
		);
	});
});