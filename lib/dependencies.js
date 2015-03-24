'use strict';

// Require modules

var _          = require('lodash');

// Define variables

var
	deps       = {},
	depsConfig = {
		autoprefixer:        'gulp-autoprefixer',
		browserSync:         'browser-sync',
		chalk:               'chalk',
		chok:                'chokidar',
		cliSpinner:          'cli-spinner',
		combineMediaQueries: 'gulp-combine-media-queries',
		Configstore:         'configstore',
		del:                 'del',
		exclude:             'gulp-ignore.exclude',
		fs:                  'fs',
		ghdownload:          'github-download',
		if:                  'gulp-if',
		include:             'gulp-ignore.include',
		lodash:              'lodash',
		minimist:            'minimist',
		minifyCss:           'gulp-minify-css',
		ncp:                 'ncp.ncp',
		path:                'path',
		pixrem:              'gulp-pixrem',
		plumber:             'gulp-plumber',
		prettyhr:            'pretty-hrtime',
		prompt:              'inquirer.prompt',
		rename:              'gulp-rename',
		rev:                 'gulp-rev',
		rubySass:            'gulp-ruby-sass',
		sass:                'gulp-sass',
		taker:               null,
		Undertaker:          'undertaker',
		updateNotifier:      'update-notifier',
		vfs:                 'vinyl-fs'

		// globule:            'globule',
		// ProgressBar:        'progress',
		// stylish:            'jshint-stylish',
		// browserSync:        'browser-sync',
		// open:               'open',
		// vinylPaths:         'vinyl-paths',
		// psi:                'psi',
		// realFavicon:        'real-favicon',
		// gulp:               'gulp',
		// plugins:            null
	}
;

// Loop over config and lazily require modules for speed

_.forIn(depsConfig, function (value, key) {
	// Shield for null values
	if (value === null) {
		return;
	}

	// For some modules, only a submodule is needed
	var subModule = value.split('.').pop();
	value = value.split('.').shift();

	Object.defineProperty(deps, key, {
		get: function () {
			return (value === subModule) ? require(value) : require(value)[subModule];
		}
	});
});

// Make an Undertaker instance

deps.taker = new deps.Undertaker();

// Set export

exports = module.exports = deps;
