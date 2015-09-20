'use strict';

var
	deps           = require('../dependencies'),
	utils          = require('../utils'),
	cli            = require('../cli'),
	settings       = require('../settings'),

	c                   = deps.chalk,
	currentRepo         = settings.global.get('repo') || settings.repo,
	questions      = [{
		type:     'input',
		message:  'Which repo should I use as boilerplate?',
		name:     'repo',
		default:  currentRepo,
		validate: function (answer) {
			if (answer.indexOf('/') < 0) {
				return c.red('Expecting `https://github.com/user/repo#ref`. (Hit backspace to continue)');
			}
			return true;
		}
	}]	
;

// Define task
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

	// Log the introduction
	console.log('\n' + [
		'Please answer the following questions to configure your installation.',
		c.bold('Hit <enter> to use the listed default value.')
	].join('\n') + '\n');

	// Start asking questions
	deps.prompt(questions, function (answers) {
		// Configure the repo globally
		settings.global.set('repo', answers.repo);

		// Done, output additional info
		console.log('\n' + [
			c.green('✔  All done!\n'),
			'I created a settingsfile at %s',
			'You can change these settings by running `headstart config`'
		].join('\n') + '\n', settings.global.path);

		cb();
	});
});