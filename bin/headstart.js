#!/usr/bin/env node
'use strict';

// To see an extended Error Stack Trace, uncomment
// Error.stackTraceLimit = 9000;

// REQUIRES -------------------------------------------------------------------
//
// Note: Gulp related requires are made further down to speed up the first
// part of this script

var 
	path                = require('path'),
	fs                  = require('fs'),
	chalk               = require('chalk'),
	_                   = require('lodash'),

	pkg                 = require('../package.json'),
	Liftoff             = require('liftoff'),
	updateNotifier      = require('update-notifier'),
	argv                = require('minimist')(process.argv.slice(2)),
	gulp,
	gulpFile
;

// CLI CONFIGURATION ----------------------------------------------------------
//

var cli = new Liftoff({
	name: 'headstart'
});

// CHECK FOR UPDATES ----------------------------------------------------------
//

var notifier = updateNotifier({
	packageName:    pkg.name,
	packageVersion: pkg.version
});

if (notifier.update) {
	// Inlined from the update-notifier source for more control
	console.log(
		chalk.yellow('\n\n┌──────────────────────────────────────────┐\n|') +
		chalk.white(' Update available: ') +
		chalk.green(notifier.update.latest) +
		chalk.grey(' (current: ' + notifier.update.current + ') ') +
		chalk.yellow('|\n|') +
		chalk.white(' Instructions can be found on:            ') +
		chalk.yellow('|\n|') +
		chalk.magenta(' http://headstart.io/upgrading-guide   ') +
		chalk.yellow('|\n') +
		chalk.yellow('└──────────────────────────────────────────┘\n')
	);
}

// LAUNCH CLI -----------------------------------------------------------------
//

cli.launch({}, launcher);

function launcher (env) {

	var 
		versionFlag  = argv.v || argv.version,
		infoFlag     = argv.i || argv.info || argv.h || argv.help,

		allowedTasks = ['init', 'build'],
		task         = argv._,
		numTasks     = task.length
	;

	// Check for version flag
	if (versionFlag) {
		logHeader(pkg);
		process.exit(0);
	}

	// Log info if no tasks are passed in
	if (!numTasks) {
		logInfo(pkg);
		process.exit(0);
	}

	// Warn if more than one tasks has been passed in
	if (numTasks > 1) {
		console.log(chalk.red('\nOnly one task can be provided. Aborting.\n'));
		logTasks();
		process.exit(0);
	}

	// We are now sure we only have 1 task
	task = task[0];

	// Print info if needed
	if(infoFlag) {
		logInfo(pkg);
		process.exit(0);
	}

	// Check if task is valid
	if (_.indexOf(allowedTasks, task) < 0) {
		console.log(chalk.red('\nThe provided task "' + task + '" was not recognized. Aborting.\n'));
		logTasks();
		process.exit(0);
	}

	// Change directory to where Headstart was called from
	if (process.cwd() !== env.cwd) {
		process.chdir(env.cwd);
		console.log(chalk.cyan('Working directory changed to', chalk.magenta(env.cwd)));
	}
	
	// Require gulp assets
	gulp     = require('gulp');
	gulpFile = require(path.join(path.dirname(fs.realpathSync(__filename)), '../gulpfile.js'));

	// Start the task through Gulp
	process.nextTick(function () {
		gulp.start.apply(gulp, [task]);
	});
}

// HELPER FUNCTIONS -----------------------------------------------------------
//

function logInfo (pkg) {
	logHeader(pkg);
	logTasks();
}

function logHeader (pkg) {
	console.log(
		chalk.cyan(
			'\n' +
			'|                  |     |              |\n' +
			'|---.,---.,---.,---|,---.|--- ,---.,---.|---\n' +
			'|   ||---\',---||   |`---.|    ,---||    |\n' +
			'`   \'`---\'`---^`---\'`---\'`---\'`---^`    `---\'\n\n'
		) +
		chalk.cyan.inverse('➳  http://headstart.io') +
		'                 ' +
		chalk.yellow.inverse('v' + pkg.version) + '\n'
	);
}

function logTasks () {
	console.log(
		chalk.grey.underline('To start a new project, run:\n\n') +
		chalk.magenta('headstart init [flags]') +
		chalk.grey(' or ') +
		chalk.magenta('hs init [flags]\n\n') +
		chalk.white('--base <source>') +
		chalk.grey('\t\tUse a custom boilerplate repo, eg. user/repo#branch\n')
	);
	console.log(
		chalk.grey.underline('To build the project, run:\n\n') +
		chalk.magenta('headstart build [flags]') +
		chalk.grey(' or ') +
		chalk.magenta('hs build [flags]\n\n') +
		chalk.white('--s, --serve') +
		chalk.grey('\t\tServe the files on a static address\n') +
		chalk.white('--o, --open') +
		chalk.grey('\t\tOpen up a browser for you (default Google Chrome)\n') +
		chalk.white('--e, --edit') +
		chalk.grey('\t\tOpen the files in your editor (default Sublime Text)\n') +
		chalk.white('--p, --production') +
		chalk.grey('\tMake a production ready build\n') +
		chalk.white('--t, --tunnel') +
		chalk.grey('\t\tTunnel your served files to the web (requires --serve)\n') +
		chalk.white('--psi') +
		chalk.grey('\t\t\tRun PageSpeed Insights (requires --serve and --tunnel)\n') +
		//chalk.white('--key <key>') +
		//chalk.grey('\t\tOptional, an API key for PSI\n') +
		chalk.white('--strategy <type>') +
		chalk.grey('\tRun PSI in either "desktop" (default) or "mobile" mode\n\n') +
		chalk.white('--verbose') +
		chalk.grey('\t\tOutput extra information while building\n')
	);
	console.log(
		chalk.grey.underline('For information, run:\n\n') +
		chalk.magenta('headstart [flags]') +
		chalk.grey(' or ') +
		chalk.magenta('hs [flags]\n\n') +
		chalk.white('--i, --info,\n--h, --help') +
		chalk.grey('\t\tPrint out this message\n') +
		chalk.white('--v, --version') +
		chalk.grey('\t\tPrint out version\n')
	);
}
