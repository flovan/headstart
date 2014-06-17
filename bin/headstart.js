#!/usr/bin/env node
'use strict';

// To see an extended Error Stack Trace, uncomment
// Error.stackTraceLimit = 9000;

var 
	path = require('path'),
	fs = require('fs'),
	chalk = require('chalk'),
	_ = require('lodash'),

	Liftoff = require('liftoff'),
	argv = require('minimist')(process.argv.slice(2)),
	gulp = require('gulp'),
	gulpFile = require(path.join(path.dirname(fs.realpathSync(__filename)), '../gulpfile.js'))
;

// CLI configuration ----------------------------------------------------------
//

var cli = new Liftoff({
	name: 'headstart',
	// completions: require('../lib/completion') TODO
}).on('require', function (name, module) {
	console.log(chalk.grey('Requiring external module: '+name+'...'));
	if (name === 'coffee-script') {
		module.register();
	}
}).on('requireFail', function (name, err) {
	console.log(chalk.black.bgRed('Unable to load:', name, err));
});

// Launch CLI -----------------------------------------------------------------
//

cli.launch({}, launcher);

function launcher (env) {

	var 
		cliPackage = require('../package'),
		versionFlag = argv.v || argv.version,

		allowedTasks = ['init', 'build', 'i', 'info'],
		task = argv._,
		numTasks = task.length
	;

	// Check for version flag
	if (versionFlag) {
		console.log('Headstart CLI version', cliPackage.version);
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
	if(task === 'i' || task === 'info') {
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
		chalk.grey('\nv' + cliPackage.version + '\nA worry-free front-end workflow\n' +
		'➳  http://headstart.flovan.me\n' +
		'\n' +
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
		'\tOpen the files in your editor (default Sublime Text)\n',
		chalk.grey('--nolr'),
		'\tDisables the livereload snippet\n',
		chalk.grey('--onlyassets'),
		'\tOnly build the assets\n'
	);
	console.log(
		chalk.magenta('i'),
		'or',
		chalk.magenta('info'),
		'to print out this message'
	);
	console.log(
		chalk.magenta('-v'),
		'or',
		chalk.magenta('--version'),
		'to print out the version of your Headstart CLI\n'
	);
}
