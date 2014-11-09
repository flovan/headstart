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

deps.gulp.task('psi', function (cb) {

	// Quit this task if no flag was set
	if(!settings.isPSI) {
		cb(null);
		return;
	}

	utils.verbose(deps.chalk.grey('Running task "psi"'));
	console.log(deps.chalk.grey('Running PageSpeed Insights (might take a while)...'));

	// Define PSI options
	var opts = {
		url:       settings.tunnelUrl,
		strategy:  settings.flags.strategy || "desktop",
		threshold: 80
	};

	// Set the key if one was passed in
	if (!!settings.flags.key && deps.lodash.isString(settings.flags.key)) {
		console.log(deps.chalk.yellow.inverse('Using a key is not yet supported as it just crashes the process. For now, continue using `--psi` without a key.'));
		// TODO: Fix key
		//opts.key = settings.flags.key;
	}

	// Run PSI
	deps.psi(opts, function (err, data) {

		// If there was an error, log it and exit
		if (err !== null) {
			console.log(deps.chalk.red('✘  Threshold of ' + opts.threshold + ' not met with score of ' + data.score));
		} else {
			console.log(deps.chalk.green('✔  Threshold of ' + opts.threshold + ' exceeded with score of ' + data.score));
		}

		cb(null);
	});
});