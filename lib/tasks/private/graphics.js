'use strict';

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings'),

	conf                = settings.config,
	rfi,
	templates
;

// Define task
deps.taker.task('graphics', function (cb) {
	console.log(deps.chalk.gray('Moving images'));

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	return deps.vfs.src([
			'src/common/img/**/*',
			'!_*'
		])
		// .pipe(deps.plumber())
		// .pipe(deps.plugins.newer(settings.config.exportAssetsImages))
		// .pipe(deps.if(settings.isProduction, deps.plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		// .pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.imgFolder))
		// .pipe(deps.if(settings.lrStarted, deps.browserSync.reload({stream:true})))
	;
});