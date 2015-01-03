'use strict';

// Require modules

var _                   = require('lodash');

// Define variables

var
	deps                = {},
	depsConfig          = {
		lodash:             'lodash',
		path:               'path',
		globule:            'globule',
		fs:                 'fs',
		ncp:                'ncp.ncp',
		chalk:              'chalk',
		ProgressBar:        'progress',
		prompt:             'inquirer.prompt',
		ghdownload:         'github-download',
		Duo:                'duo',
		stylish:            'jshint-stylish',
		browserSync:        'browser-sync',
		open:               'open',
		del:                'del',
		vinylPaths:         'vinyl-paths',
		psi:                'psi',
		realFavicon:        'real-favicon',
		gulp:               'gulp',
		plugins:            null
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

// Tell gulp-load-plugins where to find the package file

deps.plugins = require('gulp-load-plugins')({
	config: deps.path.join(__dirname, '../package.json')
});

// Set export

exports = module.exports = deps;