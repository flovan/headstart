#!/usr/bin/env node
'use strict';

// To see an extended Error Stack Trace, uncomment
// Error.stackTraceLimit = 9000;

var 
	path				= require('path'),
	fs					= require('fs'),
	chalk				= require('chalk'),
	_					= require('lodash'),

	pkg					= require('../package.json'),
	Liftoff				= require('liftoff'),
	updateNotifier		= require('update-notifier'),
	argv				= require('minimist')(process.argv.slice(2)),
	gulp				= require('gulp'),
	gulpFile			= require(path.join(path.dirname(fs.realpathSync(__filename)), '../gulpfile.js'))
;

// CLI configuration ----------------------------------------------------------
//

var cli = new Liftoff({
	name: 'headstart',
	// completions: require('../lib/completion') TODO
}).on('require', function (name, module) {
	console.log(chalk.grey('What is this I don\'t even ...'));
}).on('requireFail', function (name, err) {
	console.log(chalk.black.bgRed('Unable to load:', name, err));
});

// Check for updates ----------------------------------------------------------
//

var notifier = updateNotifier({
	packageName: pkg.name,
	packageVersion: pkg.version
});

if (notifier.update) {
	console.log(
		chalk.yellow('\n\n┌──────────────────────────────────────────┐\n|') +
		chalk.white(' Update available: ') +
		chalk.green(notifier.update.latest) +
		chalk.grey(' (current: ' + notifier.update.current + ') ') +
		chalk.yellow('|\n|') +
		chalk.white(' Instructions can be found on:            ') +
		chalk.yellow('|\n|') +
		chalk.magenta(' http://www.headstart.io/upgrading.html   ') +
		chalk.yellow('|\n') +
		chalk.yellow('└──────────────────────────────────────────┘\n')
	);
}

// Launch CLI -----------------------------------------------------------------
//

cli.launch({}, launcher);

function launcher (env) {

	var 
		versionFlag = argv.v || argv.version,
		infoFlag = argv.i || argv.info,

		allowedTasks = ['init', 'build'],
		task = argv._,
		numTasks = task.length
	;

	// Check for version flag
	if (versionFlag) {
		console.log(chalk.yellow('Headstart CLI version', pkg.version));
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

	// Start the task through Gulp
	process.nextTick(function() {
		gulp.start.apply(gulp, [task]);
	});
}

// Helper logging functions ---------------------------------------------------
//

function logInfo (pkg) {
	console.log(
		chalk.cyan(
			'\n' +
			'|                  |     |              |\n' +
			'|---.,---.,---.,---|,---.|--- ,---.,---.|---\n' +
			'|   ||---\',---||   |`---.|    ,---||    |\n' +
			'`   \'`---\'`---^`---\'`---\'`---\'`---^`    `---\'\n\n'
		) +
		chalk.cyan('➳  ' + chalk.underline('http://headstart.io')) +
		'                 ' + chalk.yellow.inverse('v' + pkg.version) + '\n\n' +
		chalk.grey('-------\n')
	);
	logTasks();
}

function logTasks () {
	console.log('Type out `headstart` followed by any of these tasks & flags:\n');
	console.log(
		chalk.magenta('init') +
		'\t\tAdd the boilerplate files to the current directory\n' +
		chalk.grey('--base') +
		'\t\tPass in a custom repo\n' +
		'\t\te.g. myuser/myrepo or myuser/myrepo#mybranch\n'
	);
	console.log(
		chalk.magenta('build') +
		'\t\tBuild the project\n' +
		chalk.grey('--production') +
		'\tMake a production ready build\n' +
		chalk.grey('--serve') +
		'\t\tServe the files on a static address\n' +
		chalk.grey('--open') +
		'\t\tOpen up a browser for you (default Google Chrome)\n' +
		chalk.grey('--edit') +
		'\t\tOpen the files in your editor (default Sublime Text)\n'
	);
	console.log(
		chalk.magenta('headstart'),
		'or',
		chalk.magenta('headstart --info'),
		'to print out this message'
	);
	console.log(
		chalk.magenta('headstart --version'),
		'to print out the version of your Headstart CLI\n'
	);
}
