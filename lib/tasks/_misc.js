'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define task

deps.undertaker.task('misc', function (cb) {
	// In --production mode, copy over all the other stuff
	if (settings.isProduction) {
		cli.toggleTaskSpinner('Moving misc files to root');

		// Make a functional version of the htaccess.txt
		deps.fs.src('misc/htaccess.txt')
			.pipe(deps.rename('.htaccess'))
			.pipe(deps.fs.dest(settings.config.exportMisc))
		;

		deps.fs.src(['misc/*', '!misc/htaccess.txt', '!_*'])
			.pipe(deps.fs.dest(settings.config.exportMisc))
		;
	}

	cb(null);
});

deps.gulp.task('other', deps.gulp.series('misc', function (cb) {
	cli.toggleTaskSpinner('Moving other assets');

	// Make sure other files and folders are copied over
	// eg. fonts, videos, ...
	return deps.fs.src([
			settings.assetsFolder + '/**/*',
			'!' + settings.assetsFolder + '/sass',
			'!' + settings.assetsFolder + '/sass/**',
			'!' + settings.assetsFolder + '/js',
			'!' + settings.assetsFolder + '/js/**',
			'!' + settings.assetsFolder + '/images',
			'!' + settings.assetsFolder + '/images/**',
			'!_*'
		])
		.pipe(deps.plumber())
		//.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		.pipe(deps.fs.dest(settings.config.exportAssets))
	;
}));
