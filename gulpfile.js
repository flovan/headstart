/*global require, process, __dirname*/

'use strict';

// REQUIRES -------------------------------------------------------------------

var
	path                = require('path'),
	globule             = require('globule'),
	fs                  = require('fs'),
	ncp                 = require('ncp').ncp,
	chalk               = require('chalk'),
	_                   = require('lodash'),
	prompt              = require('inquirer').prompt,
	sequence            = require('run-sequence'),
	ProgressBar         = require('progress'),
	stylish             = require('jshint-stylish'),
	open                = require('open'),
	ghdownload          = require('github-download'),
	browserSync         = require('browser-sync'),
	psi                 = require('psi'),
	flags               = require('minimist')(process.argv.slice(2)),
	utils               = require('./lib/utils')
;

// VARS -----------------------------------------------------------------------

var
	gitConfig           = {
		user: 'flovan',
		repo: 'headstart-boilerplate',
		ref:  '1.2.0'
	},
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
	// To get a better grip on logging by either gulp-util, console.log or direct
	// writing to process.stdout, a hook is applied to stdout when not running
	// in --vebose mode
	require('./lib/hook.js')(process.stdout).hook('write', function (msg, encoding, fd, write) {

		// Validate message
		msg = validForWrite(msg);

		// If the message is not suited for output, block it
		if (!msg) {
			return;
		}

		if (msg.length === 1) return;
		
		// There is no progress bar, so just write
		if (_.isNull(bar)) {
			write(msg);
			return;
		}
		
		// There is a progress bar, but it hasn't completed yet, so buffer
		if (!bar.complete) {
			stdoutBuffer.push(msg);
			return;
		}

		// There is a buffer, prepend a newline to the array
		if(stdoutBuffer.length) {
			stdoutBuffer.unshift('\n');
		}

		// Write out the buffer untill its empty
		while (stdoutBuffer.length) {
			write(stdoutBuffer.shift());
		}

		// Finally, just write out
		write(msg);
	});
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
