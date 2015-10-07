'use strict';

// Require modules

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings')
;

// Define task
deps.taker.task('other', function (cb) {
	cli.toggleTaskSpinner('Moving other assets');

	return deps.vfs.src([
			'src/common/**/*',
			'!src/common/sass',
			'!src/common/sass/**',
			'!src/common/js',
			'!src/common/js/**',
			'!src/common/img',
			'!src/common/img/**',
			'!src/common/ie',
			'!src/common/ie/**',
			'!_*'
		])

		// Catch possible errors down the stream
		.pipe(deps.plumber({errorHandler: utils.errorHandler}))

		// .pipe(deps.if(settings.config.revisionCaching, deps.rev()))

		// Write the files
		.pipe(deps.vfs.dest(settings.config.dist.assets))
	;
});
