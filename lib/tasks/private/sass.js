'use strict';

// Require modules

var
	deps     = require('../../dependencies'),
	utils    = require('../../utils'),
	cli      = require('../../cli'),
	settings = require('../../settings'),

	conf     = settings.config
;

// Define tasks

deps.taker.task('sass', function (cb) {
	cli.toggleTaskSpinner('Processing sass');

	// Process the style files
	return deps.vfs.src(['src/**/sass/*.{css,sass,scss}'])
		//.pipe(deps.plumber())
		//.pipe(deps.sourcemaps.init())
		.pipe(deps.sass(conf.development.sassOptions).on('error', deps.sass.logError))
		.pipe(deps.autoprefixer({ browsers: conf.development.prefixBrowsers }))
		//.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		//.pipe(deps.if(settings.isProduction, deps.minifyCss(settings.config.development.cssMinifyOptions)))
		//.pipe(deps.sourcemaps.write('./'))
		//.pipe(deps.if(settings.isProduction, deps.rename({suffix: '.min'})))
		.on('data', function (chunk) {
			chunk.isCommon = chunk.path.indexOf('common') > -1;
			this.resume();
		})
		.pipe(deps.flatten())
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.styles))
		.on('data', function (chunk) {
			utils.cacheAsset(chunk.path, chunk.isCommon);
			this.resume();
		})
		// .on('data', function (cb) {
		// 	// If revisioning is on, run templates again so the refresh contains
		// 	// the newer stylesheet
		// 	if (settings.lrStarted && settings.config.revisionCaching) {
		// 		deps.taker.series('templates')();
		// 	}
		// 	// Continue the stream
		// 	this.resume();
		// })
		//.pipe(deps.if(settings.lrStarted && !settings.config.revisionCaching, deps.browserSync.reload({stream:true})))
	;
});
