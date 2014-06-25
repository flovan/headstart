#!/usr/bin/env node
'use strict';

// To see an extended Error Stack Trace, uncomment
// Error.stackTraceLimit = 9000;

var 
	path				= require('path'),
	fs					= require('fs'),
	chalk				= require('chalk'),
	_					= require('lodash'),

	Liftoff				= require('liftoff'),
	updateNotifier		= require('update-notifier'),
	notifier			= updateNotifier({ packagePath: '../package.json' }),
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

if (notifier.update) {
	console.log(
		chalk.cyan('\n----------------------------------------\n'),
		chalk.white('Update available'),
		chalk.yellow(notifier.update.latest),
		chalk.grey('(current: ' + notifier.update.current + ')\n'),
		chalk.white('Please head over to'),
		chalk.magenta('http://www.headstart.io/upgrading.html'),
		chalk.white('for instructions\n'),
		chalk.cyan('----------------------------------------\n')
	);
}

// Launch CLI -----------------------------------------------------------------
//

cli.launch({}, launcher);

function launcher (env) {

	var 
		cliPackage = require('../package'),
		versionFlag = argv.v || argv.version,
		infoFlag = argv.i || argv.info,

		allowedTasks = ['init', 'build'],
		task = argv._,
		numTasks = task.length
	;

	// Check for version flag
	if (versionFlag) {
		console.log(chalk.yellow('Headstart CLI version', cliPackage.version));
		process.exit(0);
	}

	// Log info if no tasks are passed in
	if (!numTasks) {
		logInfo(cliPackage);
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
		logInfo(cliPackage);
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

function logInfo (cliPackage) {
	console.log(chalk.cyan(
		'\n' +
		'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n' +
		'MMMMMMMMMMMMMMMMKo;\'..         .\':d0WMMM\n' +
		'MMMMMMMMMMMMMNo.  ..\',,;;:::;;,\'.   .:0M\n' +
		'MMMMMMMMMMMMx  .dKWMMMMMMMMMMMMMMWXx,  o\n' +
		'MMMMMMMMMMMl  oWMMNl  WMMMMMMMMMMMMMM;  \n' +
		'MMMMMMMMMMk  lMMMMWd:dWMMMMMMMMMMMMMK. ,\n' +
		'MMMMMMMMMM; .NMMMMMMMMMMMMMMMMMMMMNl  ,X\n' +
		'MMMMMMMMMX. .oc;cNMMMMMMMMMMMMMMMO. .kMM\n' +
		'MMNxo:,..    .\';oWMMMMMMMMMMMMMMW. .NMMM\n' +
		'MM0\'\';codk\' .NNKOKMMMMMMMMMMMMMMK  cMMMM\n' +
		'MMMMWNKOdl.      .KMMMMMMMMMMMMMN. ;MMMM\n' +
		'd:,.     .\'  .k0XWMMMMMMMMMMMMMMM, .NMMM\n' +
		'l:coxOKNWWN,  cc;\',OMMMMMMMMMMMMMo  OMMM\n' +
		'MMMMMMN:.      .:lxNMMMMMMMMMMMMMo  OMMM\n' +
		'MMMMMMWkdxOKK\' .xWMMMMMMMMMMMMMMO. ,WMMM\n' +
		'MMMMMMMMMMMMMWo  .o0WMMMMMMMN0o\'  :NMMMM\n' +
		'MMMMMMMMMMMMMMMNo.   .\'\'\'...   \'lKMMMMMM\n' +
		'MMMMMMMMMMMMMMMMMMKo,.    .\':xXMMMMMMMMM\n' +
		'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\n',
		chalk.yellow('\nv' + cliPackage.version + '\n'),
		chalk.white('A worry-free front-end workflow\n'),
		chalk.cyan('➳  http://headstart.flovan.me\n'),
		chalk.grey('\n' +
		'-------\n')
	));
	logTasks();
}

function logTasks () {
	console.log('Please use one of the following tasks:\n');
	console.log(
		chalk.magenta('init'),
		'\t\tAdd the boilerplate files to the current directory'
	);
	console.log(
		chalk.magenta('build'),
		'\t\tBuild the project\n',
		chalk.grey('--production'),
		'\tMake a production ready build\n',
		chalk.grey('--serve'),
		'\tServe the files on a static address\n',
		chalk.grey('--open'),
		'\tOpen up a browser for you (default Google Chrome)\n',
		chalk.grey('--edit'),
		'\tOpen the files in your editor (default Sublime Text)\n'
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
