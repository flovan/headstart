'use strict';

// Require modules

var
	deps                = require('./dependencies.js'),
	settings            = require('./settings'),
	spinner             = null
;

// Set exports

exports = module.exports = {

	// Download the boilerplate files

	downloadBoilerplateFiles: function () {
		console.log(deps.chalk.grey('Downloading boilerplate files...'));

		// If a custom repo was passed in, use it
		if (!!settings.flags.base) {

			// Check if there's a slash
			if (settings.flags.base.indexOf('/') < 0) {
				console.log(deps.chalk.red('✘  Please pass in a correct repository, eg. `username/repository` or `user/repo#branch. Aborting.\n'));
				process.exit(0);
			}

			// Check if there's a reference
			if (settings.flags.base.indexOf('#') > -1) {
				settings.flags.base    = settings.flags.base.split('#');
				settings.gitConfig.ref = settings.flags.base[1];
				settings.flags.base    = settings.flags.base[0];
			} else {
				settings.gitConfig.ref = null;
			}

			// Extract username and repo
			settings.flags.base     = settings.flags.base.split('/');
			settings.gitConfig.user = settings.flags.base[0];
			settings.gitConfig.repo = settings.flags.base[1];

			// Extra validation
			if (settings.gitConfig.user.length <= 0) {
				console.log(deps.chalk.red('✘  The passed in username is invald. Aborting.\n'));
				process.exit(0);
			}
			if (settings.gitConfig.repo.length <= 0) {
				console.log(deps.chalk.red('✘  The passed in repository is invald. Aborting.\n'));
				process.exit(0);
			}
		}

		// Download the boilerplate files to a temp folder
		// This is to prevent a ENOEMPTY error
		deps.ghdownload(settings.gitConfig, settings.tmpFolder)
			// Let the user know when something went wrong
			.on('error', function (error) {
				console.log(deps.chalk.red('✘  An error occurred. Aborting.'), error);
				process.exit(0);
			})
			// Download succeeded
			.on('end', function () {
				console.log(
					deps.chalk.green('✔ Download complete!\n') +
					deps.chalk.grey('Cleaning up...\n')
				);

				// Move to working directory, clean temp, finish init
				deps.ncp(settings.tmpFolder, settings.cwd, function (err) {

					if (err) {
						console.log(deps.chalk.red('✘  Something went wrong. Please try again'), err);
						process.exit(0);
					}

					deps.sequence('clean-tmp', function () {
						exports.finishInit();
					});
				});
			})
		;
	},

	// Wrap up after downloading the boilerplate files

	finishInit: function () {
		// Ask the user if he wants to continue and
		// have the files served and opened
		deps.prompt({
				type:    'confirm',
				message: 'Would you like to have these files served?',
				name:    'build',
				default: true
		}, function (buildAnswer) {

			if (buildAnswer.build) {
				settings.isServe = true;
				deps.prompt({
						type:    'confirm',
						message: 'Should they be opened in the browser?',
						name:    'open',
						default: true

				}, function (openAnswer) {

					if (openAnswer.open) {
						settings.isOpen = true;
					}

					deps.prompt({
						type:    'confirm',
						message: 'Should they be opened in an editor?',
						name:    'edit',
						default: true

					}, function (editAnswer) {

						if (editAnswer.edit) {
							settings.isEdit = true;
						}

						deps.gulp.start('build');
					});
				});
			}
			else {
				console.log('\n');
				process.exit(0);
			}
		});
	},

	// Show a spinner while a task runs

	toggleTaskSpinner: function (task) {
		// Don't show spinners when serving
		if (settings.lrStarted) {
			return;
		}

		if (spinner !== null) {
			if (task === false || task && spinner.text.indexOf(task) < 0 ) {
				spinner.stop(true);
				console.log(deps.chalk.grey('✔  ') + spinner.text);
			}

			if (task === false) {
				spinner = null;
				return;
			}
		}
		
		spinner = new deps.Spinner(deps.chalk.grey(task));
		spinner.start();
	},

	// Handle change events for Gulp watch instances

	watchHandler: function (e) {
		console.log(deps.chalk.grey('"' + e.path.split('/').pop() + '" was ' + e.type));
	},

	// BrowserSync `init` event handler

	bsInitHandler: function (data) {
		// Store started state globally
		settings.lrStarted = true;

		// Show some logs
		console.log(deps.chalk.cyan('🌐  Local access at'), deps.chalk.magenta(data.options.urls.local));
		console.log(deps.chalk.cyan('🌐  Network access at'), deps.chalk.magenta(data.options.urls.external));

		if (settings.isOpen) {
			console.log(
				deps.chalk.cyan('☞  Opening in'),
				deps.chalk.magenta(settings.config.browser)
			);
		}

		// Open an editor if needed
		if (settings.isEdit) {
			exports.openEditor();
		}
	},

	// BrowserSync `service:running` event handler

	bsRunningHandler: function (data) {

		if (data.tunnel) {
			settings.tunnelUrl = data.tunnel;
			console.log(deps.chalk.cyan('🌐  Public access at'), deps.chalk.magenta(tunnelUrl));

			if (isPSI) {
				deps.gulp.start('psi');
			}
		} else if (settings.isPSI) {
			console.log(deps.chalk.red('✘  Running PSI cannot be started without a tunnel. Please restart Headstart with the `--tunnel` or `t` flag.'));
		}
	},

	// Open files in editor

	openEditor: function () {

		console.log(
			deps.chalk.cyan('☞  Editing in'),
			deps.chalk.magenta(settings.config.editor)
		);

		deps.open(settings.cwd, settings.config.editor);
	}
};