'use strict';

var
	_          = require('lodash'),
	deps       = {},
	depsConfig = {
		autoprefixer:        'gulp-autoprefixer',
		browserSync:         'browser-sync',
		chalk:               'chalk',
		chok:                'chokidar',
		cliSpinner:          'cli-spinner',
		combineMediaQueries: 'gulp-combine-media-queries',
		concat:              'gulp-concat',
		Configstore:         'configstore',
		del:                 'del',
		// deporder:            'gulp-deporder',
		// exclude:             'gulp-ignore.exclude',
		filter:              'gulp-filter',
		flatten:             'gulp-flatten',
		fs:                  'fs',
		ghdownload:          'github-download',
		globule:             'globule',
		hb:                  'gulp-hb',
		if:                  'gulp-if',
		// include:             'gulp-ignore.include',
		jshint:              'gulp-jshint',
		layouts:             'handlebars-layouts',
		lodash:              'lodash',
		minimist:            'minimist',
		minifyCss:           'gulp-minify-css',
		ncp:                 'ncp.ncp',
		path:                'path',
		plumber:             'gulp-plumber',
		prettyhr:            'pretty-hrtime',
		prompt:              'inquirer.prompt',
		rename:              'gulp-rename',
		// rev:                 'gulp-rev',
		sass:                'gulp-sass',
		stripDebug:          'gulp-strip-debug',
		taker:               null,
		// uglify:              'gulp-uglify',
		Undertaker:          'undertaker',
		updateNotifier:      'update-notifier',
		vfs:                 'vinyl-fs'
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
