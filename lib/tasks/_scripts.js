'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define task

deps.undertaker.task('hint-scripts', function (cb) {
	// Quit this task if hinting isn't turned on
	if (!settings.config.hint) {
		cb(null);
		return;
	}

	cli.toggleTaskSpinner('Parsing Javascript');

	// Hint all non-lib js files and exclude _ prefixed files
	return deps.fs.src([
			settings.assetsFolder + '/js/*.js',
			settings.assetsFolder + '/js/core/*.js',
			'!_*.js'
		])
		.pipe(deps.plumber())
		.pipe(deps.plugins.jshint('.jshintrc'))
		.pipe(deps.plugins.jshint.reporter(deps.stylish))
	;
});

deps.gulp.task('scripts-view', function (cb) {
	return deps.fs.src(settings.assetsFolder + '/js/view-*.js')
		.pipe(deps.plumber())
		.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		.pipe(deps.if(settings.isProduction, deps.rename({suffix: '.min'})))
		.pipe(deps.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.if(settings.isProduction, deps.plugins.uglify()))
		.pipe(deps.fs.dest(settings.config.exportAssetsJs))
	;
});

deps.gulp.task('scripts-ie', function (cb) {
	// Process .js files
	// Files are ordered for dependency sake
	deps.fs.src([
		settings.assetsFolder + '/js/ie/head/**/*.js',
		'!**/_*.js'
	])
		.pipe(deps.plumber())
		.pipe(deps.plugins.deporder())
		.pipe(deps.plugins.concat('ie-head.js'))
		.pipe(deps.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.rename({extname: '.min.js'}))
		.pipe(deps.plugins.uglify())
		.pipe(deps.fs.dest(settings.config.exportAssetsJs))
	;

	deps.fs.src([
		settings.assetsFolder + '/js/ie/body/**/*.js',
		'!**/_*.js'
	])
		.pipe(deps.plumber())
		.pipe(deps.plugins.deporder())
		.pipe(deps.plugins.concat('ie-body.js'))
		.pipe(deps.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.rename({extname: '.min.js'}))
		.pipe(deps.plugins.uglify())
		.pipe(deps.fs.dest(settings.config.exportAssetsJs))
	;

	cb(null);
});

deps.gulp.task('scripts-main', deps.gulp.series('hint-scripts', 'scripts-view', 'scripts-ie', function () {
	var files = [
		settings.assetsFolder + '/js/jquery*.js',
		settings.assetsFolder + '/js/ender*.js',

		(settings.isProduction ? '!' : '') + settings.assetsFolder + '/js/dev/*.js',

		settings.assetsFolder + '/js/**/*.js',
		// TODO: remove later
		settings.assetsFolder + '/js/core/**/*.js',
		//
		settings.assetsFolder + '/js/*.js',
		'!' + settings.assetsFolder + '/js/view-*.js',
		'!**/_*.js'
	];

	if (settings.isProduction) {
		var numFiles = deps.globule.find(files).length;
		console.log(deps.chalk.green('✄  Concatenated ' + numFiles + ' JS files'));
	}

	// Process .js files
	// Files are ordered for dependency sake
	return deps.fs.src(files, {base: '' + settings.assetsFolder + '/js'})
		.pipe(deps.plumber())
		.pipe(deps.plugins.deporder())
		.pipe(deps.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.if(settings.isProduction, deps.plugins.concat('core-libs.js')))
		.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		.pipe(deps.if(settings.isProduction, deps.rename({extname: '.min.js'})))
		.pipe(deps.if(settings.isProduction, deps.plugins.uglify()))
		.pipe(deps.fs.dest(settings.config.exportAssetsJs))
	;
}));
