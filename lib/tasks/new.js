'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define Gulp task

deps.gulp.task('new', function (cb) {
	// Get all files in working directory
	// Exclude . files (such as .DS_Store on OS X)
	var cwdFiles = deps.lodash.remove(deps.fs.readdirSync(settings.cwd), function (file) {
		return file.substring(0,1) !== '.';
	});

	// If there are any files
	if (cwdFiles.length > 0) {
		// Make sure the user knows what is about to happen
		console.log(deps.chalk.yellow.inverse('\nThe current directory is not empty!\n'));
		deps.prompt({
			type:    'confirm',
			message: 'The current directory will be cleaned. Continue?',
			name:    'override',
			default: false
		}, function (answer) {
			if (answer.override) {
				// Make really really sure that the user wants this
				deps.prompt({
					type:    'confirm',
					message: 'Removed files are gone forever. Are you sure?',
					name:    'overridconfirm',
					default: false
				}, function (answer) {

					if (answer.overridconfirm) {
						console.log(' ');
						// Clean up directory, then start downloading
						deps.gulp.series('clean-cwd', utils.downloadBoilerplateFiles)();
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
	else {
		utils.downloadBoilerplateFiles();
	}

	cb(null);
});
