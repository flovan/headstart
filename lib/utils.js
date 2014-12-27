'use strict';

var
	deps                = require('./dependencies.js'),
	settings            = require('./settings')
;

exports = module.exports = {
	// Log the Headstart CLI info header
	logHeader: function (pkg) {
		console.log(
			'\n' + deps.chalk.grey('___') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('____') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('____') + deps.chalk.cyan('/\\/\\/\\/\\/\\') + deps.chalk.grey('___') + '\n' +
			deps.chalk.grey('___') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('____') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('__') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('___________') + '\n' +
			deps.chalk.grey('___') + deps.chalk.cyan('/\\/\\/\\/\\/\\/\\') + deps.chalk.grey('____') + deps.chalk.cyan('/\\/\\/\\/\\') + deps.chalk.grey('_____') + '\n' +
			deps.chalk.grey('___') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('____') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('__________') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('___') + '\n' +
			deps.chalk.grey('___') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('____') + deps.chalk.cyan('/\\/\\') + deps.chalk.grey('__') + deps.chalk.cyan('/\\/\\/\\/\\/\\') + deps.chalk.grey('_____') + '\n\n' + deps.chalk.cyan.inverse(' ➳  http://headstart.io ') + deps.chalk.yellow.inverse(' v' + pkg.version + ' ') + '\n'
		);
	},

	// Logs the CLI options to the console
	logTasks: function () {
		console.log(
			'Usage: ' +
			deps.chalk.cyan('headstart <command> [<flag> ...]') +
			'\n' +
			'Shorthand: ' +
			deps.chalk.cyan('hs <command> [<flag> ...]') +
			'\n\n' +
			deps.chalk.underline('Possible <command> and <flag> combinations:') +
			'\n\n' +
			'init' +
			deps.chalk.grey('\t\t\tStart a new project') +
			'\n' +
			'   --base <source>' +
			deps.chalk.grey('\tUse a custom boilerplate repo, eg. user/repo#branch') +
			'\n\n' +
			'build' +
			deps.chalk.grey('\t\t\tBuild a project') +
			'\n' +
			'   --s, --serve' +
			deps.chalk.grey('\t\tServe the files on a static address') +
			'\n' +
			'   --o, --open' +
			deps.chalk.grey('\t\tOpen up a browser for you (default Google Chrome)') +
			'\n' +
			'   --e, --edit' +
			deps.chalk.grey('\t\tOpen the files in your editor (default Sublime Text)') +
			'\n' +
			'   --p, --production' +
			deps.chalk.grey('\tMake a production ready build') +
			'\n' +
			'   --t, --tunnel' +
			deps.chalk.grey('\tTunnel your served files to the web (requires --serve)') +
			'\n' +
			'   --psi' +
			deps.chalk.grey('\t\tRun PageSpeed Insights (requires --serve and --tunnel)') +
			'\n' +
			'   --strategy <type>' +
			deps.chalk.grey('\tRun PSI in either "desktop" (default) or "mobile" mode') +
			'\n' +
			'   --rs, --rubySass' +
			deps.chalk.grey('\tUse the Ruby Sass compiler (requires Sass gem)') +
			'\n\n' +
			deps.chalk.underline('Common flags:') +
			'\n\n' +
			'--verbose' +
			deps.chalk.grey('\t\tLog additional (module specific) information') +
			'\n' +
			'--i, --info,\n--h, --help' +
			deps.chalk.grey('\t\tPrint out this message') +
			'\n' +
			'--v, --version' +
			deps.chalk.grey('\t\tPrint out version') +
			'\n'
		);
	},

	// Logs an available update to the console
	logUpdate: function (update) {

		console.log(
			deps.chalk.yellow('\n\n┌──────────────────────────────────────────┐\n|') +
			deps.chalk.white(' Update available: ') +
			deps.chalk.green(update.latest) +
			deps.chalk.grey(' (current: ' + update.current + ') ') +
			deps.chalk.yellow('|\n|') +
			deps.chalk.white(' Instructions can be found on:            ') +
			deps.chalk.yellow('|\n|') +
			deps.chalk.magenta(' http://headstart.io/upgrading-guide   ') +
			deps.chalk.yellow('|\n') +
			deps.chalk.yellow('└──────────────────────────────────────────┘\n')
		);
	},

	// Patch all kinds of output to overwite module logging
	patchOutput: function () {

		// To get a better grip on logging by either gulp-util, console.log or
		// direct writing to process.stdout, a hook is applied to stdout when not
		// running in --vebose mode

		require('./hook.js')(process.stdout).hook('write', function (msg, encoding, fd, write) {

			// Validate message
			msg = exports.validateOutput(msg);

			// If the message is not suited for output, block it
			if (!msg) {
				return;
			}

			if (msg.length === 1) return;
			
			// There is no progress bar, so just write
			if (deps.lodash.isNull(settings.bar)) {
				write(msg);
				return;
			}
			
			// There is a progress bar, but it hasn't completed yet, so buffer
			if (!settings.bar.complete) {
				settings.stdoutBuffer.push(msg);
				return;
			}

			// There is a buffer, prepend a newline to the array
			if(settings.stdoutBuffer.length) {
				settings.stdoutBuffer.unshift('\n');
			}

			// Write out the buffer untill its empty
			while (settings.stdoutBuffer.length) {
				write(settings.stdoutBuffer.shift());
			}

			// Finally, just write out
			write(msg);
		});
	},

	// Validate (and if needed modify) passed in string before returning them
	validateOutput: function (msg, cleanMsg) {

		cleanMsg = deps.chalk.stripColor(msg);

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
				msg = deps.chalk.grey(msg) + '\n';

				allowFlag = true;
			}

			// Allow gulp-plumber errors,
			// but format them a bit
			if (!allowFlag && cleanMsg.indexOf('Plumber found') > - 1) {
				msg = cleanMsg.split('Plumber found unhandled error:').pop().trim();
				msg = deps.chalk.red.inverse('ERROR') + ' ' + msg + '\n';

				allowFlag = true;
			}

			// Grab the result of gulp-imagemin
			if (!allowFlag && cleanMsg.indexOf('gulp-imagemin: Minified') > -1) {
				msg = cleanMsg.split('gulp-imagemin:').pop().trim();
				msg = deps.chalk.green('✄  ' + msg) + '\n';

				allowFlag = true;
			}

			// Allow W3C validation errors,
			// but format them a bit
			if (!allowFlag && cleanMsg.indexOf('HTML Error:') > -1) {
				msg = cleanMsg.split('HTML Error:').pop().trim();
				msg = deps.chalk.red.inverse('HTML ERROR') + ' ' + msg + '\n';

				allowFlag = true;
			}

			// Grab the result of CSSMin
			if (!allowFlag && cleanMsg.indexOf('.css is now') > -1) {
				msg = cleanMsg.split(' ').slice(1).join(' ').trim();
				msg = deps.chalk.green('✄  ' + msg) + '\n';

				allowFlag = true;
			}

			// Block all the others
			if (!allowFlag) {
				return false;
			}
		}

		// Block sass-graph errors
		var graphMatches = deps.lodash.filter(['failed to resolve', 'failed to add'], function (part) {
			return cleanMsg.indexOf(part) > -1;
		});
		if (/^failed to resolve|failed to add/.test(msg)) {
			return false;
		}

		return msg;
	},

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

	// Wrap up after running init and
	// downloading the boilerplate files
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

	// Update the loadbar if one is set
	updateBar: function () {
		if (!settings.isVerbose && settings.bar !== null) {
			settings.bar.tick();
		}
	},

	// Handle change events for Gulp watch instances
	watchHandler: function (e) {

		console.log(deps.chalk.grey('"' + e.path.split('/').pop() + '" was ' + e.type));
	},

	// Browser Sync `init` event handler
	bsInitHandler: function (data) {

		var utils = this;

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

	// Browser Sync `service:running event handler
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
	},

	// Make extra logs in verbose mode
	verbose: function (msg) {

		if (settings.isVerbose) {
			console.log(msg);
		}
	}
};