'use strict';

// Require modules

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings')
;

// Define task

deps.taker.task('root', function (cb) {
	cli.toggleTaskSpinner('Moving root files');

	deps.vfs.src(['root/*', 'root/.htaccess', '!_*'])
		.pipe(deps.vfs.dest(settings.config.dist.root))
	;

	cb(null);
});