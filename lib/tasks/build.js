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
	console.log(deps.chalk.grey((settings.isVerbose ? '' : '\n') + 'Loading project configuration...'));
	deps.fs.readFile('.headstartrc', 'utf8', function (err, data) {
		if (err) {

			deps.fs.readFile('config.json', 'utf8', function (err, data) {
				if (err) {
					console.log(deps.chalk.red('✘  Cannot find .headstartrc. Run `headstart init` to start a new project.'));
				} else {
					console.log(deps.chalk.red('✘  This seems to be an older Headstart project. Please run `(sudo) npm install --g headstart-prev` and build again with `headstart-prev build [flags]`.'));
				}

				process.exit(0);
			});
		}

		// Try parsing the config data as JSON
		try {
			settings.config = JSON.parse(data);
		} catch (err) {
			console.log(deps.chalk.red('✘  The configuration file is not valid json. Aborting.'), err);
			process.exit(0);
		}

		// Allow customization of gulp-htmlmin through `config.json`
		settings.htmlminOptions = deps.lodash.assign({}, settings.htmlminOptions, settings.config.htmlminOptions || {});

		// Allow customization of the assets folder name
		settings.assetsFolder = settings.config.assetsFolder || settings.assetsFolder;

		// Modify or add some extra values to the config
		// to shorten future usage
		settings.config.exportAssetsImages = settings.config.exportAssets + '/' + settings.assetsFolder + '/' + settings.imgFolder;
		settings.config.exportAssetsJs = settings.config.exportAssets + '/' + settings.assetsFolder + '/' + settings.jsFolder;
		settings.config.exportAssetsCss = settings.config.exportAssets  + '/'+ settings.assetsFolder + '/' + settings.cssFolder;

		// Allow customization of the templates folder name
		settings.templatesFolder = settings.config.templatesFolder || settings.templatesFolder;

		// Instantiate a progressbar when not in verbose mode
		console.log(deps.chalk.grey('Building ' + (settings.isProduction ? 'production' : 'development') + ' version...\n'));

		// Run build tasks
		// Serve files if Headstart was run with the --serve flag
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

				if(settings.isServe) {
					deps.gulp.start('server');
				}
				
				cb(null);
			}
		)();
		/*deps.sequence(
			
		);*/
	});
});