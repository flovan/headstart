'use strict';

var deps     = require('../../dependencies');
var utils    = require('../../utils');
var cli      = require('../../cli');
var settings = require('../../settings');

var imagemin = require('../../imagemin');
var conf     = settings.config;

// Define task
deps.taker.task('graphics', function (cb) {
	console.log(deps.chalk.gray('Moving images'));

	var minifyFlag = settings.isProduction && settings.config.production.minifyGraphics;

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	return deps.vfs.src([
			'src/common/img/**/*.*',
			'!_*'
		])
		.pipe(deps.plumber({errorHandler: utils.errorHandler}))
		// .pipe(deps.plugins.newer(settings.config.exportAssetsImages))
		.pipe(deps.if(minifyFlag, imagemin(settings.config.production.minifyGraphicsOptions)))
		// .pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.images))
		// .pipe(deps.if(settings.lrStarted, deps.browserSync.reload({stream:true})))
	;
});
