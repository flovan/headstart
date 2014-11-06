'use strict';

// REQUIRES -------------------------------------------------------------------

var
	_                   = require('lodash'),
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
							config: path.join(__dirname, 'package.json')
						}),
	sequence            = require('run-sequence'),
	utils               = require('./lib/utils')
;

gulp.task('build', function (cb) {

	// Load the config.json file
	console.log(chalk.grey('\nLoading config.json...'));
	fs.readFile('config.json', 'utf8', function (err, data) {

		if (err) {
			console.log(chalk.red('✘  Cannot find config.json. Have you initiated Headstart through `headstart init?'), err);
			process.exit(0);
		}

		// Try parsing the config data as JSON
		try {
			config = JSON.parse(data);
		} catch (err) {
			console.log(chalk.red('✘  The config.json file is not valid json. Aborting.'), err);
			process.exit(0);
		}

		// Allow customization of gulp-htmlmin through `config.json`
		if (!_.isNull(config.htmlminOptions)) {
			htmlminOptions = _.assign({}, htmlminOptions, config.htmlminOptions);
		}

		// Instantiate a progressbar when not in verbose mode
		if (!isVerbose) {
			bar = new ProgressBar(chalk.grey('Building ' + (isProduction ? 'production' : 'development') + ' version [:bar] :percent done'), {
				complete:   '#',
				incomplete: '-',
				total:      8
			});
			updateBar();
		} else {
			console.log(chalk.grey('Building ' + (isProduction ? 'production' : 'development') + ' version...'));
		}

		// Run build tasks
		// Serve files if Headstart was run with the --serve flag
		sequence(
			'clean-export',
			[
				'sass-main',
				'scripts-main',
				'images',
				'other'
			],
			'templates',
			'manifest',
			'uncss',
			function () {
				console.log(chalk.green((!isProduction ? '\n' : '') + '✔  Build complete'));
				if(isServe) {
					gulp.start('server');
				}
				cb(null);
			}
		);
	});
});