'use strict';

// REQUIRES -------------------------------------------------------------------

var
	_                   = require('lodash'),
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
							config: path.join(__dirname, 'package.json')
						}),
	psi                 = require('psi'),
	utils               = require('./lib/utils')
;

gulp.task('psi', function (cb) {

	// Quit this task if no flag was set
	if(!isPSI) {
		cb(null);
		return;
	}

	verbose(chalk.grey('Running task "psi"'));
	console.log(chalk.grey('Running PageSpeed Insights (might take a while)...'));

	// Define PSI options
	var opts = {
		url:       tunnelUrl,
		strategy:  flags.strategy || "desktop",
		threshold: 80
	};

	// Set the key if one was passed in
	if (!!flags.key && _.isString(flags.key)) {
		console.log(chalk.yellow.inverse('Using a key is not yet supported as it just crashes the process. For now, continue using `--psi` without a key.'));
		// TODO: Fix key
		//opts.key = flags.key;
	}

	// Run PSI
	psi(opts, function (err, data) {

		// If there was an error, log it and exit
		if (err !== null) {
			console.log(chalk.red('✘  Threshold of ' + opts.threshold + ' not met with score of ' + data.score));
		} else {
			console.log(chalk.green('✔  Threshold of ' + opts.threshold + ' exceeded with score of ' + data.score));
		}

		cb(null);
	});
});