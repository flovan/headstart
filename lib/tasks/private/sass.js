'use strict';

// Require modules

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings')
;

// Define tasks

deps.taker.task('sass', function (cb) {
	cli.toggleTaskSpinner('Processing sass');
	var debug = require('gulp-debug');

	// Process the style files
	return deps.vfs.src(['src/**/sass/*.{css,sass,scss}'])
		//.pipe(deps.plumber())
		//.pipe(deps.sourcemaps.init())
		.pipe(deps.sass(settings.config.development.sassOptions).on('error', deps.sass.logError))
		.pipe(deps.autoprefixer({ browsers: settings.config.development.prefixBrowsers }))
		//.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		//.pipe(deps.if(settings.isProduction, deps.minifyCss(settings.config.development.cssMinifyOptions)))
		//.pipe(deps.sourcemaps.write('./'))
		//.pipe(deps.if(settings.isProduction, deps.rename({suffix: '.min'})))
		.pipe(deps.vfs.dest(settings.config.dist.assets))
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
