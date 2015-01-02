'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	settings            = require('../settings')
;

// Define Gulp tasks

deps.gulp.task('other', ['misc'], function (cb) {
	utils.toggleTaskSpinner('Moving other assets');

	// Make sure other files and folders are copied over
	// eg. fonts, videos, ...
	return deps.gulp.src([
			settings.assetsFolder + '/**/*',
			'!' + settings.assetsFolder + '/sass',
			'!' + settings.assetsFolder + '/sass/**',
			'!' + settings.assetsFolder + '/js',
			'!' + settings.assetsFolder + '/js/**',
			'!' + settings.assetsFolder + '/images',
			'!' + settings.assetsFolder + '/images/**',
			'!_*'
		])
		.pipe(deps.plugins.plumber())
		//.pipe(deps.plugins.if(settings.config.revisionCaching, deps.plugins.rev()))
		.pipe(deps.gulp.dest(settings.config.exportAssets))
	;
});

deps.gulp.task('misc', function (cb) {
	// In --production mode, copy over all the other stuff
	if (settings.isProduction) {
		utils.toggleTaskSpinner('Moving misc files to root');

		// Make a functional version of the htaccess.txt
		deps.gulp.src('misc/htaccess.txt')
			.pipe(deps.plugins.rename('.htaccess'))
			.pipe(deps.gulp.dest(settings.config.exportMisc))
		;

		deps.gulp.src(['misc/*', '!misc/htaccess.txt', '!_*'])
			.pipe(deps.gulp.dest(settings.config.exportMisc))
		;
	}

	cb(null);
});
