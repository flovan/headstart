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

deps.gulp.task('sass-main', ['sass-ie'], function (cb) {

	utils.verbose(deps.chalk.grey('Running task "sass-main"'));
	
	// Process the .scss files
	// While serving, this task opens a continuous watch
	return deps.gulp.src([
				settings.assetsFolder + '/sass/*.{scss, sass, css}',
				'!' + settings.assetsFolder + '/sass/*ie.{scss, sass, css}'
			])
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.if(settings.isRubySass, deps.plugins.rubySass({
			style: (settings.isProduction ? 'compressed' : 'nested')
		}), deps.plugins.sass({
			errLogToConsole: true
		})))
		.pipe(deps.plugins.if(settings.config.combineMediaQueries, deps.plugins.combineMediaQueries()))
		.pipe(deps.plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(deps.plugins.if(settings.config.revisionCaching, deps.plugins.rev()))
		// TODO: When minifyCSS bug is fixed, drop the noAdvanced feature
		// (https://github.com/jakubpawlowicz/clean-css/issues/375)
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.minifyCss({ compatibility: 'ie8', noAdvanced: true })))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.rename({suffix: '.min'})))
		.pipe(deps.gulp.dest(settings.config.exportAssetsCss))
		.on('data', function (cb) {

			// If revisioning is on, run templates again so the refresh contains
			// the newer stylesheet
			if (settings.lrStarted && settings.config.revisionCaching) {
				deps.gulp.start('templates');
			}

			// Continue the stream
			this.resume();
		})
		.on('end', utils.updateBar)
		.pipe(deps.plugins.if(settings.lrStarted && !settings.config.revisionCaching, deps.browserSync.reload({stream:true})))
	;
});

deps.gulp.task('sass-ie', function (cb) {

	utils.verbose(deps.chalk.grey('Running task "sass-ie"'));
	
	// Process the .scss files
	// While serving, this task opens a continuous watch
	return deps.gulp.src([
				settings.assetsFolder + '/sass/*ie.{scss, sass, css}',
				settings.assetsFolder + '/sass/ie*.{scss, sass, css}'
			])
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.if(settings.isRubySass, deps.plugins.rubySass({
			style: (settings.isProduction ? 'compressed' : 'nested')
		}), deps.plugins.sass({
			errLogToConsole: true
		})))
		.pipe(deps.plugins.rename({suffix: '.min'}))
		.pipe(deps.gulp.dest(settings.config.exportAssetsCss))
	;
});