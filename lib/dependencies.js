'use strict';

// Set export

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
	realFavicon:        require('real-favicon'),
	gulp:               require('gulp'),
	plugins:            null
};

// Tell gulp-load-plugins where to find the package file

module.exports.plugins = require('gulp-load-plugins')({
	config: module.exports.path.join(__dirname, '../package.json')
});