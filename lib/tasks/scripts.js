'use strict';

// REQUIRES -------------------------------------------------------------------

var
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	}),
	stylish             = require('jshint-stylish'),
	utils               = require('./lib/utils')
;

// JSHint options:	http://www.jshint.com/docs/options/
gulp.task('hint-scripts', function (cb) {
	
	// Quit this task if hinting isn't turned on
	if (!config.hint) {
		cb(null);
		return;
	}
	
	verbose(chalk.grey('Running task "hint-scripts"'));

	// Hint all non-lib js files and exclude _ prefixed files
	return gulp.src([
			'assets/js/*.js',
			'assets/js/core/*.js',
			'!_*.js'
		])
		.pipe(plugins.plumber())
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter(stylish))
	;
});

gulp.task('scripts-main', ['hint-scripts', 'scripts-view', 'scripts-ie'], function () {

	var files = [
		'assets/js/libs/jquery*.js',
		'assets/js/libs/ender*.js',

		(isProduction ? '!' : '') + 'assets/js/libs/dev/*.js',

		'assets/js/libs/**/*.js',
		// TODO: remove later
		'assets/js/core/**/*.js',
		//
		'assets/js/*.js',
		'!assets/js/view-*.js',
		'!**/_*.js'
	];
	
	verbose(chalk.grey('Running task "scripts-main"'));

	if (isProduction) {
		var numFiles = globule.find(files).length;
		console.log(chalk.green('✄  Concatenated ' + numFiles + ' JS files'));
	}

	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src(files, {base: '' + 'assets/js'})
		.pipe(plugins.plumber())
		.pipe(plugins.deporder())
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.if(isProduction, plugins.concat('core-libs.js')))
		.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(plugins.if(isProduction, plugins.rename({extname: '.min.js'})))
		.pipe(plugins.if(isProduction, plugins.uglify()))
		.pipe(gulp.dest(config.export_assets + '/assets/js'))
		.on('end', updateBar)
	;
});

gulp.task('scripts-view', function (cb) {
	
	verbose(chalk.grey('Running task "scripts-view"'));

	return gulp.src('assets/js/view-*.js')
		.pipe(plugins.plumber())
		.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(plugins.if(isProduction, plugins.rename({suffix: '.min'})))
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.if(isProduction, plugins.uglify()))
		.pipe(gulp.dest(config.export_assets + '/assets/js'))
	;
});

gulp.task('scripts-ie', function (cb) {
	
	verbose(chalk.grey('Running task "scripts-ie"'));

	// Process .js files
	// Files are ordered for dependency sake
	gulp.src([
		'assets/js/ie/head/**/*.js',
		'!**/_*.js'
	])
		.pipe(plugins.plumber())
		.pipe(plugins.deporder())
		.pipe(plugins.concat('ie-head.js'))
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.rename({extname: '.min.js'}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(config.export_assets + '/assets/js'));

	gulp.src([
		'assets/js/ie/body/**/*.js',
		'!**/_*.js'
	])
		.pipe(plugins.plumber())
		.pipe(plugins.deporder())
		.pipe(plugins.concat('ie-body.js'))
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.rename({extname: '.min.js'}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(config.export_assets + '/assets/js'));

	cb(null);
});