'use strict';

var deps     = require('../../dependencies');
var utils    = require('../../utils');
var cli      = require('../../cli');
var settings = require('../../settings');

// Define task
deps.taker.task('root', function (cb) {
	console.log(deps.chalk.gray('Moving root files'));

	deps.vfs.src(['root/**/*', '!_*'])

		// Write the files
		.pipe(deps.vfs.dest(settings.config.dist.root))
	;

	cb(null);
});
