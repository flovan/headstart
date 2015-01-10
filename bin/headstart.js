#!/usr/bin/env node
'use strict';

// Require modules

var 
	path                = require('path'),
	fs                  = require('fs'),
	chalk               = require('chalk'),
	updateNotifier      = require('update-notifier'),
	argv                = require('minimist')(process.argv.slice(2)),

	pkg                 = require('../package.json'),
	cli                 = require('../lib/cli'),
	settings			= require('../lib/settings')
;

// Define variables

var
	notifier,
	versionFlag         = argv.v || argv.version,
	infoFlag            = argv.i || argv.info || argv.h || argv.help,

	task                = argv._,
	numTasks            = task.length
;

// Check for updates

notifier = updateNotifier({
	packageName:    pkg.name,
	packageVersion: pkg.version
}).notify();

if (notifier.update) {
	console.log('Instructions can be found on: http://headstart.io/upgrading-guide');
}

// Check for version flag

if (versionFlag) {
	cli.logHeader(pkg);
	process.exit(0);
}

// Print info if needed or if no tasks are passed in

if(infoFlag || !numTasks) {
	cli.logHeader(pkg);
	cli.logTasks();
	process.exit(0);
}

// Warn if more than one tasks has been passed in

if (numTasks > 1) {
	console.log(chalk.red('\nOnly one task can be provided. Aborting.\n'));
	cli.logTasks();
	process.exit(0);
}

// We are now sure we only have 1 task

task = task[0];

// Check if task is valid

if (cli.tasks.indexOf(task) < 0) {
	console.log(chalk.red('\nThe provided task "' + task + '" was not recognized. Aborting.\n'));
	cli.logTasks();
	process.exit(0);
}

// Register Gulp tasks through external files

fs.readdirSync(path.join(__dirname, '../lib/tasks')).forEach(function(file) {
	require('../lib/tasks/' + file);
});

// Patch the output when not running verbose mode

if (!settings.isVerbose) {
	cli.patchOutput();
}

// Start the task through Gulp

process.nextTick(function () {
	require('gulp').parallel(task)();
});
