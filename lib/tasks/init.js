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

deps.gulp.task('init', function (cb) {

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
			message: 'Initializing will empty the current directory. Continue?',
			name:    'override',
			default: false
		}, function (answer) {

			if (answer.override) {
				// Make really really sure that the user wants this
				deps.prompt({
					type:    'confirm',
					message: 'Removed files are gone forever. Continue?',
					name:    'overridconfirm',
					default: false
				}, function (answer) {

					if (answer.overridconfirm) {
						// Clean up directory, then start downloading
						console.log(deps.chalk.grey('\nEmptying current directory'));
						deps.sequence('clean-tmp', 'clean-cwd', utils.downloadBoilerplateFiles);
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
		console.log('\n');
		utils.downloadBoilerplateFiles();
	}

	cb(null);
});