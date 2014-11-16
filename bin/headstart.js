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

	settings			= require('../lib/settings'),
	utils               = require('../lib/utils'),
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
	utils.logUpdate(notifier.update);
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

// Prepare tasks, output, and run the task
// ----------------------------------------------------------------------------

// Register Gulp tasks through external files
fs.readdirSync(path.join(__dirname, '../lib/tasks')).forEach(function(file) {
	require('../lib/tasks/' + file);
});

// Patch the output when not running verbose mode
if (!settings.isVerbose) {
	utils.patchOutput();
}

// Start the task through Gulp
process.nextTick(function () {
	require('gulp').start(task);
});
