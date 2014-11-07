#!/usr/bin/env node
'use strict';

// Require modules
// ----------------------------------------------------------------------------

var 
	path                = require('path'),
	fs                  = require('fs'),
	chalk               = require('chalk'),
	_                   = require('lodash'),
	updateNotifier      = require('update-notifier'),
	argv                = require('minimist')(process.argv.slice(2)),

	utils               = require('./lib/utils'),
	settings			= requiire('./lib/settings')(argv),
	pkg                 = require('../package.json')
;

// Define variables
// ----------------------------------------------------------------------------

var
	deps,
	notifier,
	versionFlag         = argv.v || argv.version,
	infoFlag            = argv.i || argv.info || argv.h || argv.help,

	allowedTasks        = ['init', 'build'],
	task                = argv._,
	numTasks            = task.length
;

// Check for updates
// ----------------------------------------------------------------------------

notifier = updateNotifier({
	packageName:    pkg.name,
	packageVersion: pkg.version
});

// If there is an update ...
if (notifier.update) {
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

// Check if any info needs to be written out
// Doing this as early as possible to have near instant feedback
// ----------------------------------------------------------------------------

// Check for version flag
if (versionFlag) {
	utils.logHeader(pkg);
	process.exit(0);
}

// Print info if needed
if(infoFlag) {
	utils.logHeader(pkg);
	utils.logTasks();
	process.exit(0);
}

// Log info if no tasks are passed in
if (!numTasks) {
	utils.logHeader(pkg);
	utils.logTasks();
	process.exit(0);
}

// Make sure the passed in tasks are known and can be run
// ----------------------------------------------------------------------------

// Warn if more than one tasks has been passed in
if (numTasks > 1) {
	console.log(chalk.red('\nOnly one task can be provided. Aborting.\n'));
	utils.logTasks();
	process.exit(0);
}

// We are now sure we only have 1 task
task = task[0];

// Check if task is valid
if (_.indexOf(allowedTasks, task) < 0) {
	console.log(chalk.red('\nThe provided task "' + task + '" was not recognized. Aborting.\n'));
	utils.logTasks();
	process.exit(0);
}

// Prepare tasks, Gulp, and run the task
// ----------------------------------------------------------------------------

// Register Gulp tasks through external files
require('./lib/tasks/init');
require('./lib/tasks/build');
require('./lib/tasks/clean');
require('./lib/tasks/styles');
require('./lib/tasks/scripts');
require('./lib/tasks/graphics');
require('./lib/tasks/misc');
require('./lib/tasks/templates');
require('./lib/tasks/manifest');
require('./lib/tasks/server');
require('./lib/tasks/services');

// Start the task through Gulp
process.nextTick(function () {
	require('gulp').start(task);
});
