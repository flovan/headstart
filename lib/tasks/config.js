'use strict';

var
	deps           = require('../dependencies'),
	utils          = require('../utils'),
	cli            = require('../cli'),
	settings       = require('../settings'),

	c                   = deps.chalk,
	_                   = deps.lodash,
	defaults            = {
		repo:         'flovan/headstart-boilerplate#major-release-v2'
	},
	currentRepo         = settings.global.get('repo') || defaults.repo,
	questions      = [{
		type:     'input',
		message:  'Which repo should I use as boilerplate?',
		name:     'repo',
		default:  currentRepo,
		validate: function (answer) {
			var res = utils.validateAndSetRepo(answer, false);
			return res;
		}
	}]	
;

// Define tasks
deps.taker.task('config', function (cb) {
	// If there are no global settings yet, log Clippy
	if (!settings.global.size) {
		console.log('\n' + [
			'╭-╮      ' + c.cyan('Hello!'),
			'|' + c.cyan('⦿') + '|' + c.cyan('⦿') + '  ~  It looks like you\'re using',
			'| ╯|     Headstart for the first time.',
			'╰--╯'
		].join('\n'));
	}

	console.log('\n' + [
		'Please answer the following questions to configure your installation.',
		c.bold('Hit <enter> to use the listed default value.')
	].join('\n') + '\n');

	deps.prompt(questions, function (answers) {
		// Write out global settings
		settings.global.set('repo', answers.repo);

		console.log('\n' + [
			c.green('✔  All done!\n'),
			'I created a settingsfile at %s',
			'You can change these settings by running `headstart config`'
		].join('\n') + '\n', settings.global.path);

		cb();
	});
});
