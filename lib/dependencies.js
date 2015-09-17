'use strict';

var
	_          = require('lodash'),
	deps       = {},
	depsConfig = {
		// autoprefixer:        'gulp-autoprefixer',
		// browserSync:         'browser-sync',
		chalk:               'chalk',
		// chok:                'chokidar',
		cliSpinner:          'cli-spinner',
		// combineMediaQueries: 'gulp-combine-media-queries',
		// concat:              'gulp-concat',
		Configstore:         'configstore',
		del:                 'del',
		// deporder:            'gulp-deporder',
		// exclude:             'gulp-ignore.exclude',
		fs:                  'fs',
		ghdownload:          'github-download',
		// globule:             'globule',
		// if:                  'gulp-if',
		// include:             'gulp-ignore.include',
		// jshint:              'gulp-jshint',
		lodash:              'lodash',
		// less:                'gulp-less',
		minimist:            'minimist',
		// minifyCss:           'gulp-minify-css',
		ncp:                 'ncp.ncp',
		path:                'path',
		// pixrem:              'gulp-pixrem',
		// plumber:             'gulp-plumber',
		prettyhr:            'pretty-hrtime',
		prompt:              'inquirer.prompt',
		// rename:              'gulp-rename',
		// rev:                 'gulp-rev',
		// rubySass:            'gulp-ruby-sass',
		// sass:                'gulp-sass',
		// sourcemaps:          'gulp-sourcemaps',
		// stripDebug:          'gulp-strip-debug',
		// stylish:             'jshint-stylish',
		// stylus:              'gulp-stylus',
		taker:               null,
		// uglify:              'gulp-uglify',
		Undertaker:          'undertaker',
		updateNotifier:      'update-notifier',
		// vfs:                 'vinyl-fs'
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

// Set exports
exports = module.exports = deps;
