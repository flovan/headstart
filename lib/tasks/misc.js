'use strict';

// REQUIRES -------------------------------------------------------------------

var
	deps                = require('./lib/dependencies'),
	utils               = require('./lib/utils'),
	settings            = require('./lib/settings')
;

gulp.task('other', ['misc'], function (cb) {
	
	verbose(chalk.grey('Running task "other"'));

	// Make sure other files and folders are copied over
	// eg. fonts, videos, ...
	return gulp.src([
			'assets/**/*',
			'!assets/sass',
			'!assets/sass/**/*',
			'!assets/js/**/*',
			'!assets/images/**/*',
			'!_*'
		])
		.pipe(plugins.plumber())
		//.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(gulp.dest(config.export_assets + '/assets'))
		.on('end', updateBar)
	;
});

gulp.task('misc', function (cb) {
	
	// In --production mode, copy over all the other stuff
	if (isProduction) {
		verbose(chalk.grey('Running task "misc"'));

		// Make a functional version of the htaccess.txt
		gulp.src('misc/htaccess.txt')
			.pipe(plugins.rename('.htaccess'))
			.pipe(gulp.dest(config.export_misc))
		;

		gulp.src(['misc/*', '!misc/htaccess.txt', '!_*'])
			.pipe(gulp.dest(config.export_misc))
		;
	}

	cb(null);
});