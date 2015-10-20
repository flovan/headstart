'use strict';

var
	deps            = require('../lib/dependencies'),
	settings        = require('./settings'),

	_               = deps.lodash,
	c               = deps.chalk,
	structure       = [{
			command: 'new',
			description: 'Start a new project',
			flags: [{
				flag: '--base <source>',
				description: 'Use a custom boilerplate repo, eg. user/repo#branch'
			}]
		}, {
			command: 'build',
			description: 'Build a project',
			flags: [{
				flag: '-p, --production',
				description: 'Optimize files for production'
			}]
		}, {
			command: 'serve',
			description: 'Build a project continuously',
			flags: [{
				flag: '-p, --production',
				description: 'Optimize files for production'
			}, {
				flag: '-t, --tunnel',
				description: 'Open up a public web tunnel'
			}]
		}, {
			command: 'config',
			description: 'Configure global defaults'
		}, {
			flags: [{
				flag: '--verbose',
				description: 'Display all the available module logs'
			}]
		}
	],
	indentCharacter = '  ',
	longestFlag     = 0,
	spinner         = null,
	queuedTask      = null,
	spinnerTimer
;

// Pads a string with spaces
function strPadTo (str, len) {
	while (str.length < len) {
		str = str + ' ';
	}
	return str;
}

// Find the longest flag
//
// Lodash chain rom the inside out:
// - grab all "flags" values
// - flatten them recursively
// - remove all falsy values (compact)
// - grab all "flag" values
// - find out which once is the longest

longestFlag = _.reduce(_.pluck(_.compact(_.flatten(_.pluck(structure, 'flags'), true)), 'flag'), function (max, flag) {
	return flag.length > max.length ? flag : max;
}).length + indentCharacter.length;

// Set spinner
deps.cliSpinner.Spinner.setDefaultSpinnerString(9);

// Set exports
exports = module.exports = {
	// Logs the CLI options
	logTasks: function (v) {
		console.log('\nUsage: headstart <command> <flags>');
		console.log('Available combinations:\n');

		_.each(structure, function (cmd, cmdKey, cmdList) {
			if (cmd.command) {
				console.log(strPadTo(cmd.command, longestFlag) + indentCharacter + cmd.description + (!cmd.flags ? '\n' : ''));
			}
			_.each(cmd.flags, function (flag, flagKey, flagList) {
				flag.flag = (cmd.command ? indentCharacter : '') + flag.flag;

				console.log(strPadTo(flag.flag, longestFlag) + indentCharacter + flag.description);
			});
		});

		console.log('\nheadstart@%s %s', v, deps.path.dirname(__dirname));
	},

	// Show a spinner while a task runs
	toggleTaskSpinner: function (task) {
		// Don't show spinners when serving
		if (settings.lrStarted) {
			return;
		}

		if (queuedTask !== null) {
			console.log(c.grey(`✔  ${queuedTask} (${deps.prettyhr(process.hrtime(spinnerTimer))})`));

			if (task === null) {
				queuedTask = null;
				return;
			}
		}

		queuedTask = task;
		spinnerTimer = process.hrtime();

		// if (spinner !== null) {
		// 	spinner.stop(true);
		// 	console.log(c.grey(`✔  ${spinner.text} (${deps.prettyhr(process.hrtime(spinnerTimer))})`));

		// 	if (task === null) {
		// 		spinner = null;
		// 		return;
		// 	}
		// }

		// spinner = new deps.cliSpinner.Spinner(task);
		// spinner.start();
		// spinnerTimer = process.hrtime();
	},

	structure: structure,
	tasks: _.compact(_.flatten(_.pluck(structure, 'command')))
};
