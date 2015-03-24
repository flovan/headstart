#!/usr/bin/env node
'use strict';

// Require modules

var
	deps        = require('../lib/dependencies'),
	pkg         = require('../package.json'),
	cli         = require('../lib/cli'),
	settings	= require('../lib/settings'),
	utils       = require('../lib/utils')
;

// Define variables

var
	c           = deps.chalk,
	argv        = deps.minimist(process.argv.slice(2)),
	versionFlag = argv.v || argv.version,
	infoFlag    = argv.i || argv.info || argv.h || argv.help,

	task        = argv._,
	taskDir     = deps.path.join(__dirname, '../lib/tasks'),

	notifier, spacer, current, latest, instructions, link
;

// Define functions

function cleanTask (task) {
	// Make sure we only have one task
	if (task.length > 1) {
		console.log(c.red('\nOnly one task can be provided. Aborting.\n'));
		cli.logTasks();
		process.exit(0);
	}

	// Grab that task
	task = task[0];

	// Check if it is valid by comparing it the the CLI
	if (cli.tasks.indexOf(task) < 0) {
		console.log(c.red('\nThe provided task "' + task + '" was not recognized. Aborting.\n'));
		cli.logTasks();
		process.exit(0);
	}

	return task;
}

function checkUpdates () {
	notifier = deps.updateNotifier({pkg: pkg, updateCheckInterval: 0});
	if (notifier.update) {

		spacer = c.yellow('| '),
		current = c.gray('(current: ' + notifier.update.current + ')'),
		latest = c.green(notifier.update.latest),
		instructions = c.cyan('(sudo) npm update -g headstart'),
		link = c.cyan.underline('http://headstart.io/upgrade')

		console.log('\n' + [
			spacer + 'New version available: ' + latest + ' ' + current,
			spacer,
			spacer + 'Run ' + instructions + ' to update',
			spacer + 'Further instruction on: ' + link
		].join('\n'));
	}
}

function checkFlags () {
	// Check for version flag
	if (versionFlag) {
		cli.logHeader(pkg);
		process.exit(0);
	}

	// Print info if needed or if no tasks are passed in
	if(infoFlag || !task.length) {
		cli.logHeader(pkg);
		cli.logTasks();
		process.exit(0);
	}
}

function init () {
	// Clean the passed in task
	task = cleanTask(task);

	// Register all tasks
	require(taskDir);

	// If there are no global settings and we are not configuring,
	// run the config task. Otherwise, just run the task
	if (task !== 'config' && !settings.global.size) {
		deps.taker.series('config', task);
	} else {
		deps.taker.parallel(task)();
	}
}

// Execute logic

checkUpdates();
checkFlags();
init();
