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

deps.gulp.task('images', function (cb) {
	
	utils.verbose(deps.chalk.grey('Running task "images"'));

	// Make a copy of the favicon.png, and make a .ico version for IE
	// Move to root of export folder
	deps.gulp.src('assets/images/icons/favicon.png')
		.pipe(deps.plugins.rename({extname: '.ico'}))
		//.pipe(deps.plugins.if(settings.config.revisionCaching, deps.plugins.rev()))
		.pipe(deps.gulp.dest(settings.config.export_misc))
	;

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	return deps.gulp.src([
			'assets/images/**/*',
			'!_*'
		])
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.newer(settings.config.export_assets_images))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		//.pipe(deps.plugins.if(settings.config.revisionCaching, deps.plugins.rev()))
		.pipe(deps.gulp.dest(settings.config.export_assets_images))
		.pipe(deps.plugins.if(settings.lrStarted, deps.browserSync.reload({stream:true})))
	;
});