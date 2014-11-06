'use strict';

// REQUIRES -------------------------------------------------------------------

var
	_                   = require('lodash'),
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	}),
	prompt              = require('inquirer').prompt,
	sequence            = require('run-sequence'),
	utils               = require('./lib/utils')
;

gulp.task('init', function (cb) {

	// Get all files in working directory
	// Exclude . files (such as .DS_Store on OS X)
	var cwdFiles = _.remove(fs.readdirSync(cwd), function (file) {

		return file.substring(0,1) !== '.';
	});

	// If there are any files
	if (cwdFiles.length > 0) {

		// Make sure the user knows what is about to happen
		console.log(chalk.yellow.inverse('\nThe current directory is not empty!'));
		prompt({
			type:    'confirm',
			message: 'Initializing will empty the current directory. Continue?',
			name:    'override',
			default: false
		}, function (answer) {

			if (answer.override) {
				// Make really really sure that the user wants this
				prompt({
					type:    'confirm',
					message: 'Removed files are gone forever. Continue?',
					name:    'overridconfirm',
					default: false
				}, function (answer) {

					if (answer.overridconfirm) {
						// Clean up directory, then start downloading
						console.log(chalk.grey('Emptying current directory'));
						sequence('clean-tmp', 'clean-cwd', downloadBoilerplateFiles);
					}
					// User is unsure, quit process
					else process.exit(0);
				});
			}
			// User is unsure, quit process
			else process.exit(0);
		});
	}
	// No files, start downloading
	else downloadBoilerplateFiles();

	cb(null);
});