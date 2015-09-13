#!/usr/bin/env node
'use strict';

// PHASE 1
// Put basic CLI options on the fast track

var
	pkg         = require('../package.json'),
	cli         = require('../lib/cli'),
	deps        = require('../lib/dependencies'),
	settings	= require('../lib/settings'),
	utils       = require('../lib/utils'),

	argv        = deps.minimist(process.argv.slice(2)),
	task        = argv._[0],
	versionFlag = argv.v || argv.version,
	infoFlag    = argv.i || argv.info || argv.h || argv.help || task === 'help' || task === 'info'
;

// Check for version flag
if (versionFlag) {
	console.log(pkg.version);
	process.exit(1);
}

// Print info if needed or if no tasks are passed in
if(infoFlag || !task) {
	cli.logTasks(pkg.version);
	process.exit(1);
}

// PHASE 2
// Check for updates and handle non-basic input and run tasks.

var
	c           = deps.chalk,
	taskDir     = deps.path.join(__dirname, '../lib/tasks'),
	notifier    = deps.updateNotifier({pkg: pkg, updateCheckInterval: 0})
;

// Check for updates
if (notifier.update) {
	notifier.notify();
}

// Check if it is valid by comparing it the the CLI
if (cli.tasks.indexOf(task) < 0) {
	console.log(c.red('\nThe provided task "' + task + '" was not recognized. Aborting.\n'));
	process.exit(1);
}

// Register all tasks
require(taskDir);

// If there are no global settings and we are not configuring,
// run the config task. Otherwise, just run the task
if (task !== 'config' && !settings.global.size) {
	deps.taker.series('config', task);
} else {
	deps.taker.parallel(task)();
}