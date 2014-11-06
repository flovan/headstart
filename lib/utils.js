'use strict';

var
	_                   = require('lodash'),
	chalk               = require('chalk'),
	open                = require('open'),
	ghdownload          = require('github-download'),
	gitConfig           = {
							user: 'flovan',
							repo: 'headstart-boilerplate',
							ref:  '1.2.0'
						}
;

exports = module.exports = {
	// Patch all kinds of output to overwite module logging
	patchOutput: function () {

		// To get a better grip on logging by either gulp-util, console.log or
		// direct writing to process.stdout, a hook is applied to stdout when not
		// running in --vebose mode

		var utils = this;

		require('./hook.js')(process.stdout).hook('write', function (msg, encoding, fd, write) {

			// Validate message
			msg = utils.validateOutput(msg);

			// If the message is not suited for output, block it
			if (!msg) {
				return;
			}

			if (msg.length === 1) return;
			
			// There is no progress bar, so just write
			if (_.isNull(bar)) {
				write(msg);
				return;
			}
			
			// There is a progress bar, but it hasn't completed yet, so buffer
			if (!bar.complete) {
				stdoutBuffer.push(msg);
				return;
			}

			// There is a buffer, prepend a newline to the array
			if(stdoutBuffer.length) {
				stdoutBuffer.unshift('\n');
			}

			// Write out the buffer untill its empty
			while (stdoutBuffer.length) {
				write(stdoutBuffer.shift());
			}

			// Finally, just write out
			write(msg);
		});
	},

	// Validate (and if needed modify) passed in string before returning them
	validateOutput: function (msg, cleanMsg) {

		cleanMsg = chalk.stripColor(msg);

		// Detect gulp-util "[XX:XX:XX] ..." logs, 
		if (/^\[[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}\]/.test(cleanMsg)) {
			var allowFlag = false;

			// Allow gulp-ruby-sass errors,
			// but format them a bit
			if (cleanMsg.indexOf('was changed') > -1) {
				msg = cleanMsg.split(' ');
				msg.shift();
				msg[0] = msg[0].split('/').pop();
				msg = msg.join(' ').trim();
				msg = chalk.grey(msg) + '\n';

				allowFlag = true;
			}

			// Allow gulp-plumber errors,
			// but format them a bit
			if (!allowFlag && cleanMsg.indexOf('Plumber found') > - 1) {
				msg = cleanMsg.split('Plumber found unhandled error:').pop().trim();
				msg = chalk.red.inverse('ERROR') + ' ' + msg + '\n';

				allowFlag = true;
			}

			// Grab the result of gulp-imagemin
			if (!allowFlag && cleanMsg.indexOf('gulp-imagemin: Minified') > -1) {
				msg = cleanMsg.split('gulp-imagemin:').pop().trim();
				msg = chalk.green('✄  ' + msg) + '\n';

				allowFlag = true;
			}

			// Allow W3C validation errors,
			// but format them a bit
			if (!allowFlag && cleanMsg.indexOf('HTML Error:') > -1) {
				msg = cleanMsg.split('HTML Error:').pop().trim();
				msg = chalk.red.inverse('HTML ERROR') + ' ' + msg + '\n';

				allowFlag = true;
			}

			// Grab the result of CSSMin
			if (!allowFlag && cleanMsg.indexOf('.css is now') > -1) {
				msg = cleanMsg.split(' ').slice(1).join(' ').trim();
				msg = chalk.green('✄  ' + msg) + '\n';

				allowFlag = true;
			}

			// Block all the others
			if (!allowFlag) {
				return false;
			}
		}

		// Block sass-graph errors
		var graphMatches = _.filter(['failed to resolve', 'failed to add'], function (part) {
			return cleanMsg.indexOf(part) > -1;
		});
		if (/^failed to resolve|failed to add/.test(msg)) {
			return false;
		}

		return msg;
	},

	// Download the boilerplate files
	downloadBoilerplateFiles: function () {

		console.log(chalk.grey('\nDownloading boilerplate files...'));

		// If a custom repo was passed in, use it
		if (!!flags.base) {

			// Check if there's a slash
			if (flags.base.indexOf('/') < 0) {
				console.log(chalk.red('✘  Please pass in a correct repository, eg. `username/repository` or `user/repo#branch. Aborting.\n'));
				process.exit(0);
			}

			// Check if there's a reference
			if (flags.base.indexOf('#') > -1) {
				flags.base    = flags.base.split('#');
				gitConfig.ref = flags.base[1];
				flags.base    = flags.base[0];
			} else {
				gitConfig.ref = null;
			}

			// Extract username and repo
			flags.base     = flags.base.split('/');
			gitConfig.user = flags.base[0];
			gitConfig.repo = flags.base[1];

			// Extra validation
			if (gitConfig.user.length <= 0) {
				console.log(chalk.red('✘  The passed in username is invald. Aborting.\n'));
				process.exit(0);
			}
			if (gitConfig.repo.length <= 0) {
				console.log(chalk.red('✘  The passed in repository is invald. Aborting.\n'));
				process.exit(0);
			}
		}

		// Download the boilerplate files to a temp folder
		// This is to prevent a ENOEMPTY error
		ghdownload(gitConfig, tmpFolder)
			// Let the user know when something went wrong
			.on('error', function (error) {
				console.log(chalk.red('✘  An error occurred. Aborting.'), error);
				process.exit(0);
			})
			// Download succeeded
			.on('end', function () {
				console.log(
					chalk.green('✔ Download complete!\n') +
					chalk.grey('Cleaning up...')
				);

				// Move to working directory, clean temp, finish init
				ncp(tmpFolder, cwd, function (err) {

					if (err) {
						console.log(chalk.red('✘  Something went wrong. Please try again'), err);
						process.exit(0);
					}

					sequence('clean-tmp', function () {
						finishInit();
					});
				});
			})
			// TODO: Try to catch the error when a ZIP has "NOEND"
		;
	},

	// Wrap up after running init and
	// downloading the boilerplate files
	finishInit: function () {

		// Ask the user if he wants to continue and
		// have the files served and opened
		prompt({
				type:    'confirm',
				message: 'Would you like to have these files served?',
				name:    'build',
				default: true
		}, function (buildAnswer) {

			if (buildAnswer.build) {
				isServe = true;
				prompt({
						type:    'confirm',
						message: 'Should they be opened in the browser?',
						name:    'open',
						default: true

				}, function (openAnswer) {

					if (openAnswer.open) isOpen = true;
					prompt({
						type:    'confirm',
						message: 'Should they be opened in an editor?',
						name:    'edit',
						default: true

					}, function (editAnswer) {

						if (editAnswer.edit) isEdit = true;
						gulp.start('build');
					});
				});
			}
			else process.exit(0);
		});
	},

	// Update the loadbar if one is set
	updateBar: function () {
		if (!isVerbose && bar !== null) {
			bar.tick();
		}
	},

	// Browser Sync `init` event handler
	bsInitHandler: function (data) {

		// Store started state globally
		lrStarted = true;

		// Show some logs
		console.log(chalk.cyan('🌐  Local access at'), chalk.magenta(data.options.urls.local));
		console.log(chalk.cyan('🌐  Network access at'), chalk.magenta(data.options.urls.external));

		if (isOpen) {
			console.log(
				chalk.cyan('☞  Opening in'),
				chalk.magenta(config.browser)
			);
		}

		// Open an editor if needed
		if (isEdit) {
			openEditor();
		}
	},

	// Browser Sync `service:running event handler
	bsRunningHandler: function (data) {

		if (data.tunnel) {
			tunnelUrl = data.tunnel;
			console.log(chalk.cyan('🌐  Public access at'), chalk.magenta(tunnelUrl));

			if (isPSI) {
				gulp.start('psi');
			}
		} else if (isPSI) {
			console.log(chalk.red('✘  Running PSI cannot be started without a tunnel. Please restart Headstart with the `--tunnel` or `t` flag.'));
		}
	},

	// Open files in editor
	openEditor: function () {

		console.log(
			chalk.cyan('☞  Editing in'),
			chalk.magenta(config.editor)
		);
		open(cwd, config.editor);
	},

	// Make extra logs in verbose mode
	verbose: function (msg) {

		if(isVerbose) console.log(msg);
	}
};