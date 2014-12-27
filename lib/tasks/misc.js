'use strict';

// Require modules
// ----------------------------------------------------------------------------

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	settings            = require('../settings')
;

// Define Gulp task
// ----------------------------------------------------------------------------

deps.gulp.task('other', ['misc'], function (cb) {
	
	utils.verbose(deps.chalk.grey('Running task "other"'));

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
		.on('end', utils.updateBar)
	;
});

deps.gulp.task('misc', function (cb) {
	
	// In --production mode, copy over all the other stuff
	if (settings.isProduction) {
		utils.verbose(deps.chalk.grey('Running task "misc"'));

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