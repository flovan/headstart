'use strict';

var deps           = require('../dependencies');
var utils          = require('../utils');
var cli            = require('../cli');
var settings       = require('../settings');

var c                   = deps.chalk;
var currentRepo         = settings.global.get('repo') || settings.repo;
var questions      = [{
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
}, {
	type:     'checkbox',
	message:  'Can I help you write better code?',
	name:     'hint',
	choices:  ['Sass', 'Javascript'],
	default:  ['Sass', 'Javascript']
}];

// Define task
deps.taker.task('config', function (cb) {
	// If there are no global settings yet, log Clippy
	if (!settings.global.size) {
		console.log('\n' + [
			'╭-╮      ' + c.cyan('Hello!'),
			'|' + c.cyan('⦿') + '|' + c.cyan('⦿') + '  ~  It looks like you\'re using',
			'| ╯|     Headstart for the first time.',
			'╰--╯',
			'\nPlease answer the following questions to configure your installation.'
		].join('\n'));
	}

	// Log the introduction
	console.log('\n' + c.bold('Hit <enter> to use the listed default value.') + '\n');

	// Start asking questions
	deps.prompt(questions, function (answers) {
		// Copy answers to global repo
		settings.global.set('repo', answers.repo);
		settings.global.set('hint', answers.hint);

		// Done, output additional info
		console.log('\n' + [
			'Great, thanks!\n',
			'Your settings were saved at %s',
			'You can change these settings by running `headstart config`.'
		].join('\n') + '\n', settings.global.path);

		cb();
	});
});