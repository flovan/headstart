'use strict';

// REQUIRES -------------------------------------------------------------------

var
	path                = require('path'),
	globule             = require('globule'),
	fs                  = require('fs'),
	ncp                 = require('ncp').ncp,
	chalk               = require('chalk'),
	ProgressBar         = require('progress'),
	flags               = require('minimist')(process.argv.slice(2)),
	utils               = require('./lib/utils')
;

// VARS -----------------------------------------------------------------------

var
	cwd                 = process.cwd(),
	tmpFolder           = '.tmp',
	stdoutBuffer        = [],
	lrStarted           = false,
	htmlminOptions      = {
		removeComments:                true,
		collapseWhitespace:            true,
		collapseBooleanAttributes:     true,
		removeAttributeQuotes:         true,
		useShortDoctype:               true,
		removeScriptTypeAttributes:    true,
		removeStyleLinkTypeAttributes: true,
		minifyJS:                      true,
		minifyCSS:                     true
	},
	isProduction        = ( flags.production || flags.p ) || false,
	isServe             = ( flags.serve || flags.s ) || false,
	isOpen              = ( flags.open || flags.o ) || false,
	isEdit              = ( flags.edit || flags.e ) || false,
	isVerbose           = flags.verbose || false,
	isTunnel            = ( flags.tunnel || flags.t ) || false,
	tunnelUrl           = null,
	isPSI               = flags.psi || false,
	config              = null,
	bar                 = null
;

// LOGGING --------------------------------------------------------------------
//

if (!isVerbose) {
	utils.patchOutput();
}

// TASK REQUIRES --------------------------------------------------------------
//

require('./lib/tasks/init');
require('./lib/tasks/build');
require('./lib/tasks/clean');
require('./lib/tasks/styles');
require('./lib/tasks/scripts');
require('./lib/tasks/graphics');
require('./lib/tasks/misc');
require('./lib/tasks/templates');
require('./lib/tasks/manifest');
require('./lib/tasks/server');
require('./lib/tasks/services');
