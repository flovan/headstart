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

deps.gulp.task('hint-scripts', function (cb) {
	
	// Quit this task if hinting isn't turned on
	if (!settings.config.hint) {
		cb(null);
		return;
	}
	
	utils.verbose(deps.chalk.grey('Running task "hint-scripts"'));

	// Hint all non-lib js files and exclude _ prefixed files
	return deps.gulp.src([
			settings.assetsFolder + '/js/*.js',
			settings.assetsFolder + '/js/core/*.js',
			'!_*.js'
		])
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.jshint('.jshintrc'))
		.pipe(deps.plugins.jshint.reporter(deps.stylish))
	;
});

deps.gulp.task('scripts-main', ['hint-scripts', 'scripts-view', 'scripts-ie'], function () {

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
	
	utils.verbose(deps.chalk.grey('Running task "scripts-main"'));

	if (settings.isProduction) {
		var numFiles = deps.globule.find(files).length;
		console.log(deps.chalk.green('✄  Concatenated ' + numFiles + ' JS files'));
	}

	// Process .js files
	// Files are ordered for dependency sake
	return deps.gulp.src(files, {base: '' + settings.assetsFolder + '/js'})
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.deporder())
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.concat('core-libs.js')))
		.pipe(deps.plugins.if(settings.config.revisionCaching, deps.plugins.rev()))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.rename({extname: '.min.js'})))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.uglify()))
		.pipe(deps.gulp.dest(settings.config.exportAssetsJs))
		.on('end', utils.updateBar)
	;
});

deps.gulp.task('scripts-view', function (cb) {
	
	utils.verbose(deps.chalk.grey('Running task "scripts-view"'));

	return deps.gulp.src(settings.assetsFolder + '/js/view-*.js')
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.if(settings.config.revisionCaching, deps.plugins.rev()))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.rename({suffix: '.min'})))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.uglify()))
		.pipe(deps.gulp.dest(settings.config.exportAssetsJs))
	;
});

deps.gulp.task('scripts-ie', function (cb) {
	
	utils.verbose(deps.chalk.grey('Running task "scripts-ie"'));

	// Process .js files
	// Files are ordered for dependency sake
	deps.gulp.src([
		settings.assetsFolder + '/js/ie/head/**/*.js',
		'!**/_*.js'
	])
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.deporder())
		.pipe(deps.plugins.concat('ie-head.js'))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.plugins.rename({extname: '.min.js'}))
		.pipe(deps.plugins.uglify())
		.pipe(deps.gulp.dest(settings.config.exportAssetsJs));

	deps.gulp.src([
		settings.assetsFolder + '/js/ie/body/**/*.js',
		'!**/_*.js'
	])
		.pipe(deps.plugins.plumber())
		.pipe(deps.plugins.deporder())
		.pipe(deps.plugins.concat('ie-body.js'))
		.pipe(deps.plugins.if(settings.isProduction, deps.plugins.stripDebug()))
		.pipe(deps.plugins.rename({extname: '.min.js'}))
		.pipe(deps.plugins.uglify())
		.pipe(deps.gulp.dest(settings.config.exportAssetsJs));

	cb(null);
});