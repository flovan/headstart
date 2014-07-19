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
		//console.log('\n' + chalk.yellow.inverse('Headstart CLI version', pkg.version) + '\n');
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

	// Start the task through Gulp
	process.nextTick(function() {
		gulp.start.apply(gulp, [task]);
	});
}

// Helper logging functions ---------------------------------------------------
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
		chalk.cyan('➳  ' + chalk.underline('http://headstart.io')) +
		'                 ' + chalk.yellow.inverse('v' + pkg.version) + '\n'
	);
}

function logTasks () {
	console.log(chalk.grey('-------\n'));
	console.log(
		chalk.magenta('headstart init') +
		chalk.grey(' ~ Download boilerplate files\n\n')+
		chalk.white('--base=<username/repository#branch>') +
		chalk.grey(' ~ Use a custom boilerplate repo\n')
	);
	console.log(chalk.grey('-------\n'));
	console.log(
		chalk.magenta('headstart build') +
		chalk.grey(' ~ Build the project\n\n') +
		chalk.white('--production') +
		chalk.grey(' ~ Make a production ready build\n') +
		chalk.white('--serve') +
		chalk.grey(' ~ Serve the files on a static address\n') +
		chalk.white('--open') +
		chalk.grey(' ~ Open up a browser for you (default Google Chrome)\n') +
		chalk.white('--edit') +
		chalk.grey(' ~ Open the files in your editor (default Sublime Text)\n\n') +
		chalk.white('--psi') +
		chalk.grey(' ~ Run PageSpeed Insights after building (requires --serve)\n') +
		chalk.white('--key=<key>') +
		chalk.grey(' ~ Optional, an API key for PSI\n') +
		chalk.white('--strategy=<desktop|mobile>') +
		chalk.grey(' ~ PSI strategy to use, defaults to desktop\n\n') +
		chalk.white('--verbose') +
		chalk.grey(' ~ Output extra information while building\n')
	);
	console.log(chalk.grey('-------\n'));
	console.log(
		chalk.magenta('headstart') +
		chalk.grey(' or ') +
		chalk.magenta('headstart --info') +
		chalk.grey(' ~ Print out this message')
	);
	console.log(
		chalk.magenta('headstart --version') +
		chalk.grey(' or ') +
		chalk.magenta('headstart --v') +
		chalk.grey(' ~ Print out version\n')
	);
	console.log(chalk.grey('-------\n'));
}
