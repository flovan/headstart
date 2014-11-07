'use strict';

// REQUIRES -------------------------------------------------------------------

var
	deps                = require('./lib/dependencies'),
	utils               = require('./lib/utils'),
	settings            = require('./lib/settings')
;

gulp.task('sass-main', ['sass-ie'], function (cb) {

	// Flag to catch empty streams
	// https://github.com/floatdrop/gulp-watch/issues/87
	var isEmptyStream = true;

	verbose(chalk.grey('Running task "sass-main"'));
	
	// Process the .scss files
	// While serving, this task opens a continuous watch
	return gulp.src([
				'assets/sass/*.{scss, sass, css}',
				'!assets/sass/*ie.{scss, sass, css}'
			])
		.pipe(plugins.plumber())
		.pipe(plugins.rubySass({ style: (isProduction ? 'compressed' : 'nested') }))
		.pipe(plugins.if(config.combineMediaQueries, plugins.combineMediaQueries()))
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		// TODO: When minifyCSS bug is fixed, drop the noAdvanced feature
		// (https://github.com/jakubpawlowicz/clean-css/issues/375)
		.pipe(plugins.if(isProduction, plugins.minifyCss({ compatibility: 'ie8', noAdvanced: true })))
		.pipe(plugins.if(isProduction, plugins.rename({suffix: '.min'})))
		.pipe(gulp.dest(config.export_assets + '/assets/css'))
		.on('data', function (cb) {

			// If revisioning is on, run templates again so the refresh contains
			// the newer stylesheet
			if (lrStarted && config.revisionCaching) {
				gulp.start('templates');
			}

			// Continue the stream
			this.resume();
		})
		.on('end', updateBar)
		.pipe(plugins.if(lrStarted && !config.revisionCaching, browserSync.reload({stream:true})))
	;
});

gulp.task('sass-ie', function (cb) {

	// Flag to catch empty streams
	// https://github.com/floatdrop/gulp-watch/issues/87
	var isEmptyStream = true;
	
	verbose(chalk.grey('Running task "sass-ie"'));
	
	// Process the .scss files
	// While serving, this task opens a continuous watch
	return gulp.src([
				'assets/sass/*ie.{scss, sass, css}'
			])
		.pipe(plugins.plumber())
		.pipe(plugins.rubySass({ style: (isProduction ? 'compressed' : 'nested') }))
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest(config.export_assets + '/assets/css'))
	;
});