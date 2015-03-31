'use strict';

// Require modules

var
	deps           = require('../dependencies'),
	utils          = require('../utils'),
	cli       = require('../cli'),
	settings       = require('../settings')
;

// Define variables

var
	c                   = deps.chalk,
	_                   = deps.lodash,
	preProcessors       = [{
		name:      'Sass',
		extension: 'scss, sass, css',
		settings:  {
			ruby: {
				errLogToConsole: true
			},
			regular: {
				style: (settings.isProduction ? 'compressed' : 'nested')
			}
		}
	}, {
		name:      'Less',
		extension: 'less',
		settings: {
			regular: {

			}
		}
	}, {
		name:      'Stylus',
		extension: 'styl',
		settings: {
			regular: {

			}
		}
	}],
	defaults            = {
		browser:      'Google Chrome',
		editor:       'Sublime Text',
		repo:         'flovan/headstart-boilerplate#major-release-v2'
	},
	currentBrowser      = settings.global.get('browser') || defaults.browser,
	currentEditor       = settings.global.get('editor') || defaults.editor,
	currentRepo         = settings.global.get('repo') || defaults.repo,
	currentPreProcessor = settings.global.get('preProcessor') || preProcessors[0],
	questions      = [{
		type:     'input',
		message:  'Which browser do you develop in?',
		name:     'browser',
		default:  currentBrowser
	}, {
		type:     'input',
		message:  'Which code editor do you use?',
		name:     'editor',
		default:  currentEditor
	}, {
		type:     'input',
		message:  'What is the boilerplate repository?',
		name:     'repo',
		default:  currentRepo,
		validate: function (answer) {
			var res = utils.validateAndMapRepo(answer, false);
			return res;
		}
	}, {
		type:     'list',
		message:  'Which CSS pre-processor will you be using?',
		name:     'preProcessor',
		choices:  _.pluck(preProcessors, 'name'),
		default:  currentPreProcessor.name
	}]
;

// Define functions

function getRandom (arr) {
	return c.bold(arr[Math.round(Math.random()*(arr.length - 1))]);
}

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

	console.log(c.cyan([
		'| HINT:',
		'| Browsers and editor might have different names depending on the OS.',
		'| If an identifier doesn\'t work, try a different one',
		'| eg. Google Chrome, google-chrome, Firefox, firefox, ...'

	].join('\n')) + '\n');

	deps.prompt(questions, function (answers) {
		// Write out global settings
		settings.global.set('browser', answers.browser);
		settings.global.set('editor', answers.editor);
		settings.global.set('repo', answers.repo);
		settings.global.set('preProcessor', _.findWhere(preProcessors, {name: answers.preProcessor}));

		console.log('\n' + [
			c.green('✔  All done!'),
			'\nYou can change these settings by running `headstart config`'
		].join('\n') + '\n');

		cb();
	});
});
