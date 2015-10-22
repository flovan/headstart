'use strict';

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings')
;

// Define task
deps.taker.task('root', function (cb) {
	console.log(deps.chalk.gray('Moving root files'));

	deps.vfs.src(['root/*', 'root/.htaccess', '!_*'])

		// Write the files
		.pipe(deps.vfs.dest(settings.config.dist.root))
	;

	cb(null);
});