'use strict';

// Require modules through an object so they can be easily used by other
// files that require this file
// ----------------------------------------------------------------------------

exports = module.exports = {
	_:                  require('lodash'),
	path:               require('path'),
	globule:            require('globule'),
	fs:                 require('fs'),
	ncp:                require('ncp').ncp,
	chalk:              require('chalk'),
	ProgressBar:        require('progress'),
	prompt:             require('inquirer').prompt,
	sequence:           require('run-sequence'),
	stylish:            require('jshint-stylish'),
	browserSync:        require('browser-sync'),
	psi:                require('psi'),
	gulp:               require('gulp'),
	plugins             require('gulp-load-plugins')({
							config: path.join(__dirname, 'package.json')
						}),

	utils:              require('./lib/utils'),
	settings:           require('./lib/settings')
};