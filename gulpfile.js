'use strict';

// REQUIRES -------------------------------------------------------------------

var
	path                = require('path'),
	globule             = require('globule'),
	fs                  = require('fs'),
	ncp                 = require('ncp').ncp,
	chalk               = require('chalk'),
	ProgressBar         = require('progress'),
	utils               = require('./lib/utils')
;

// GLOBAL SETTINGS ------------------------------------------------------------
//
// This object gets shared with the task partials

require('./lib/settings');

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
