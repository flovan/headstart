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

	utils.verbose(deps.chalk.grey('Running task "build"'));

	// Load the config.json file
	console.log(deps.chalk.grey('\nLoading config.json...'));
	deps.fs.readFile('config.json', 'utf8', function (err, data) {

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

		// Modify or add some extra values to the config
		// to shorten future usage
		settings.config.export_assets = settings.config.export_assets + '/assets';
		settings.config.export_assets_images = settings.config.export_assets + settings.imgFolder;
		settings.config.export_assets_js = settings.config.export_assets + settings.jsFolder;
		settings.config.export_assets_css = settings.config.export_assets + settings.cssFolder;

		// Allow customization of gulp-htmlmin through `config.json`
		settings.htmlminOptions = deps.lodash.assign({}, settings.htmlminOptions, settings.config.htmlminOptions || {});

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