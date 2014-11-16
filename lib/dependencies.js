'use strict';

// Require modules through an object so they can be easily used by other
// files that require this file
// ----------------------------------------------------------------------------

exports = module.exports = {
	lodash:             require('lodash'),
	path:               require('path'),
	globule:            require('globule'),
	fs:                 require('fs'),
	ncp:                require('ncp').ncp,
	chalk:              require('chalk'),
	ProgressBar:        require('progress'),
	prompt:             require('inquirer').prompt,
	ghdownload:         require('github-download'),
	sequence:           require('run-sequence'),
	stylish:            require('jshint-stylish'),
	browserSync:        require('browser-sync'),
	open:               require('open'),
	del:                require('del'),
	vinylPaths:         require('vinyl-paths'),
	psi:                require('psi'),
	gulp:               require('gulp'),
	plugins:            null
};

// gulp-load-plugins needs path to load in the package file
// so it needs to be require'd after defining module.exports
module.exports.plugins = require('gulp-load-plugins')({
	config: module.exports.path.join(__dirname, '../package.json')
});