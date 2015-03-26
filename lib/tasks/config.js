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
		name: 'Sass',
		deps: [{
			name: 'gulp-ruby-sass',
			version: '1.0.x'
		}, {
			name: 'gulp-sass',
			version: '1.3.x'
		}]
	}, {
		name: 'Less',
		deps: [{
			name: 'gulp-less',
			version: '3.0.x'
		}]
	}, {
		name: 'Stylus',
		deps: [{
			name: 'gulp-stylus',
			version: '2.0.x'
		}]
	}],
	defaults            = {
		browser:      'Google Chrome',
		editor:       'Sublime Text',
		repo:         'flovan/headstart-boilerplate#major-release-v2',
		preProcessor: _.pluck(preProcessors, 'name')[0]
	},
	currentBrowser      = settings.global.get('browser') || defaults.browser,
	currentEditor       = settings.global.get('editor') || defaults.editor,
	currentRepo         = settings.global.get('repo') || defaults.repo,
	currentPreProcessor = settings.global.get('preProcessor') || defaults.preProcessor,
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
		choices:  ['Sass', 'Less', 'Stylus'],
		default:  currentPreProcessor
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
		var spawn, args;

		// Write out global settings
		settings.global.set('browser', answers.browser);
		settings.global.set('editor', answers.editor);
		settings.global.set('repo', answers.repo);
		settings.global.set('preProcessor', answers.preProcessor);

		// Start spinner
		// cli.toggleTaskSpinner('Installing dependencies');

		// Find out the dependencies for the chosen preprocessor
		args = _.map(_.findWhere(preProcessors, {
			name: answers.preProcessor
		}).deps, function (dep) {
		 	return dep.name + '@' + dep.version;
		});

		// Add the npm install command
		args.unshift('npm', 'install');

		// Spawn the install process with sudo
		// Make sure they get installed into the headstart dir
		console.log('\n' + c.cyan('| To install modules, your password is needed!'))
		spawn = deps.sudo(args, {
			prompt: 'Enter your password:',
			spawnOptions: {
				cwd: settings.modulesFolder,
				cachePassword: false
			}
		});

		// Attach some listeners
		spawn.stdout.on('message', function (data) {
			console.log('Spawn stdout message:', data);
		});

		spawn.stdout.on('data', function (data) {
			console.log('Spawn stdout data:', data);
		});

		spawn.stdout.on('end', function () {
			// cli.toggleTaskSpinner(false);
			//console.log(foo.stdout);

			console.log('\n' + [
				c.green('✔  All done!'),
				'You can change these settings by running `headstart config`'
			].join('\n') + '\n');

			cb();
		});
	});
});
