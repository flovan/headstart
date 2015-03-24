'use strict';

// Require modules

var
	deps       = require('./dependencies'),
	cli        = require('./cli'),
	settings   = require('./settings')
;

// Define variables

var
	c          = deps.chalk,
	slashError = 'Repository should be formatted as `username/repository` or `user/repo#branch.',
	userError  = 'Username is invald.',
	repoError  = 'Repository is invald.'
;

// Set exports

exports = module.exports = {

	// Validate a repository and map it to the settings module

	validateAndMapRepo: function (repo, exit) {
		exit = exit === undefined ? true : exit;

		// Check if there's a slash
		if (repo.indexOf('/') < 0) {
			if (exit) {
				console.log(c.red('✘  ' + slashError + ' Aborting.\n'));
				process.exit(0);
			}
			return slashError;
		}

		// Check if there's a reference
		if (repo.indexOf('#') > -1) {
			repo = repo.split('#');
			settings.gitConfig.ref = repo[1];
			repo = repo[0];
		} else {
			settings.gitConfig.ref = null;
		}

		// Extract username and repo
		repo = repo.split('/');
		settings.gitConfig.user = repo[0];
		settings.gitConfig.repo = repo[1];

		// Extra validation
		if (settings.gitConfig.user.length <= 0) {
			if (exit) {
				console.log(c.red('✘  ' + userError + ' Aborting.\n'));
				process.exit(0);
			}

			return userError;
		}

		if (settings.gitConfig.repo.length <= 0) {
			if (exit) {
				console.log(c.red('✘  ' + repoError + ' Aborting.\n'));
				process.exit(0);
			}

			return repoError;
		}

		return true;
	},

	// Excecute a command through a child process

	runCmd: function (cmd, opts) {
		var
			spawn = require('child_process').spawn,
			child = spawn(cmd, opts.args),
			me 	= this
		;

		child.stdout.on('data', function (buffer) {
			opts.cb(me, buffer)
		});

		child.stdout.on('end', opts.end);
	}

	//
	// // Handle change events for Gulp watch instances
	//
	// watchHandler: function (e) {
	// 	console.log(c.grey('"' + e.path.split('/').pop() + '" was ' + e.type));
	// },
	//
	// // BrowserSync `init` event handler
	//
	// bsInitHandler: function (data) {
	// 	// Store started state globally
	// 	settings.lrStarted = true;
	//
	// 	// Show some logs
	// 	console.log(c.cyan('🌐  Local access at'), c.magenta(data.options.urls.local));
	// 	console.log(c.cyan('🌐  Network access at'), c.magenta(data.options.urls.external));
	//
	// 	if (settings.isOpen) {
	// 		console.log(
	// 			c.cyan('☞  Opening in'),
	// 			c.magenta(settings.config.browser)
	// 		);
	// 	}
	//
	// 	// Open an editor if needed
	// 	if (settings.isEdit) {
	// 		exports.openEditor();
	// 	}
	// },
	//
	// // BrowserSync `service:running` event handler
	//
	// bsRunningHandler: function (data) {
	// 	if (data.tunnel) {
	// 		settings.tunnelUrl = data.tunnel;
	// 		console.log(c.cyan('🌐  Public access at'), c.magenta(tunnelUrl));
	//
	// 		if (settings.isPSI) {
	// 			deps.gulp.start('psi');
	// 		}
	// 	} else if (settings.isPSI) {
	// 		console.log(c.red('✘  Running PSI cannot be started without a tunnel. Please restart Headstart with the `--tunnel` or `t` flag.'));
	// 	}
	// },
	//
	// // Open files in editor
	//
	// openEditor: function () {
	// 	console.log(
	// 		c.cyan('☞  Editing in'),
	// 		c.magenta(settings.config.editor)
	// 	);
	//
	// 	deps.open(settings.cwd, settings.config.editor);
	// }
};
