'use strict';

var
	deps      = require('../dependencies'),
	utils     = require('../utils'),
	cli       = require('../cli'),
	settings  = require('../settings'),

	c = deps.chalk,
	questions = [{
		type:    'confirm',
		message: 'The current directory will be cleaned. Continue?',
		name:    'override',
		default: false
	}, {
		type:    'confirm',
		message: 'Removed files are gone forever. Are you sure?',
		name:    'overrideConfirm',
		default: false,
		when: function( answers ) {
			return answers.override;
		}
	}],
	finishQuestion = [{
		type:    'list',
		message: 'What should I do next?',
		name:    'action',
		choices: ['Nothing', 'Build', 'Serve'],
		default: 'Nothing'
	}]
;

// Download the boiler plate repo
function downloadBoilerplateFiles () {
	cli.toggleTaskSpinner(c.grey('Downloading boilerplate files...'));

	// If a custom repo was passed in, validate it
	if (!!settings.flags.base) {
		utils.validateAndSetRepo(settings.flags.base);
	} else {
		utils.validateAndSetRepo(settings.global.get('repo'));
	}

	// Download the boilerplate files to a temp folder
	// This is to prevent a ENOEMPTY error
	deps.ghdownload(settings.gitConfig, settings.tmpFolder)
		// Let the user know when something went wrong
		.on('error', function (error) {
			console.log(c.red('✘  Downloading the boilerplate failed. `new` instruction cancelled.'), error);
			process.exit(0);
		})
		// Download succeeded
		.on('end', function () {
			cli.toggleTaskSpinner(false);
			console.log(c.green('✔  Download complete!'));

			// Move to working directory, clean temp, finish init
			deps.ncp(settings.tmpFolder, settings.cwd, function (err) {
				if (err) {
					console.log(c.red('✘  Moving the new files failed. Please try again...'), err);
					process.exit(0);
				}

				deps.taker.series('clean-tmp', finishNew)();
			});
		})
	;
}

// Finish the setup
function finishNew () {
	cli.toggleTaskSpinner(false);
	console.log('');

	// Ask the user if he wants to continue and
	// have the files served and opened
	deps.prompt(finishQuestions, function (answers) {
		// If the user doesn't wan to build, exit the project
		if (!answers.action === 'Nothing') {
			process.exit(0);
		}

		// If user wants to serve, set flag
		if (answers.action === 'Serve') {
			settings.isServe = true;
		}

		// Build the project
		deps.taker.parallel('build')();
	});
}

// Define "new" task
deps.taker.task('new', function (cb) {
	// Get all files in working directory
	// Exclude . files (such as .DS_Store on OS X)
	var cwdFiles = deps.lodash.remove(deps.fs.readdirSync(settings.cwd), function (file) {
		return file.substring(0,1) !== '.' && file !== '.tmp';
	});

	// Check if the working directory is empty
	if (cwdFiles.length > 0) {
		console.log(c.yellow.inverse('\nThe current directory is not empty!\n'));

		// Make sure the user knows what is about to happen
		deps.prompt(questions, function (answers) {
			// If there was a "no" stop everything
			if (!answers.override || !answers.overrideConfirm) {
				console.log(c.yellow('`new` instruction cancelled\n'));
				process.exit(0);
			}

			// Otherwise, clean up directory, then start downloading
			console.log('');
			deps.taker.series('clean-cwd', downloadBoilerplateFiles)();
		});
	} else {
		downloadBoilerplateFiles();
	}
});
