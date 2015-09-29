'use strict';

// Require modules

var
	deps     = require('../../dependencies'),
	utils    = require('../../utils'),
	cli      = require('../../cli'),
	settings = require('../../settings'),

	conf     = settings.config
;

// Define task

// deps.taker.task('hint-scripts', function (cb) {
// 	// Quit this task if hinting isn't turned on
// 	if (!settings.config.hint) {
// 		cb(null);
// 		return;
// 	}

// 	cli.toggleTaskSpinner('Hinting scripts');

// 	// Hint all non-lib js files and exclude _ prefixed files
// 	return deps.vfs.src([
// 			settings.assetsFolder + '/js/*.js',
// 			'!_*.js'
// 		])
// 		.pipe(deps.plumber())
// 		.pipe(deps.jshint('.jshintrc'))
// 		.pipe(deps.jshint.reporter(deps.stylish))
// 	;
// });

// deps.taker.task('scripts-view', function (cb) {
// 	return deps.vfs.src(settings.assetsFolder + '/js/view-*.js')
// 		.pipe(deps.plumber())
// 		//.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
// 		.pipe(deps.if(settings.isProduction, deps.rename({suffix: '.min'})))
// 		.pipe(deps.if(settings.isProduction, deps.stripDebug()))
// 		.pipe(deps.if(settings.isProduction, deps.uglify()))
// 		.pipe(deps.vfs.dest(settings.config.exportAssetsJs))
// 	;
// });

// deps.taker.task('scripts-ie', function (cb) {
// 	// Process .js files
// 	// Files are ordered for dependency sake
// 	deps.vfs.src([
// 		settings.assetsFolder + '/js/ie/head/**/*.js',
// 		'!**/_*.js'
// 	])
// 		.pipe(deps.plumber())
// 		.pipe(deps.deporder())
// 		.pipe(deps.concat('ie-head.js'))
// 		.pipe(deps.if(settings.isProduction, deps.stripDebug()))
// 		.pipe(deps.rename({extname: '.min.js'}))
// 		.pipe(deps.uglify())
// 		.pipe(deps.vfs.dest(settings.config.exportAssetsJs))
// 	;

// 	deps.vfs.src([
// 		settings.assetsFolder + '/js/ie/body/**/*.js',
// 		'!**/_*.js'
// 	])
// 		.pipe(deps.plumber())
// 		.pipe(deps.deporder())
// 		.pipe(deps.concat('ie-body.js'))
// 		.pipe(deps.if(settings.isProduction, deps.stripDebug()))
// 		.pipe(deps.rename({extname: '.min.js'}))
// 		.pipe(deps.uglify())
// 		.pipe(deps.vfs.dest(settings.config.exportAssetsJs))
// 	;

// 	cb(null);
// });

deps.taker.task('scripts-common', function (cb) {
	return deps.vfs.src([
		'src/common/js/lib/*.js',
		'src/common/js/plugin/*.js',
		'src/common/js/**/*.js',
		'ie/**/*.js',
		'!**/_*.js'
	])
		.pipe(deps.flatten())
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.script))
});

deps.taker.task('scripts', deps.taker.series(
	/*'hint-scripts',
	'scripts-view',
	'scripts-ie',*/
	function (cb) {
		cli.toggleTaskSpinner('Parsing scripts');
		cb();
	},
	'scripts-common'
	// function () {
	// 	var files = [
	// 		settings.assetsFolder + '/js/jquery*.js',
	// 		settings.assetsFolder + '/js/ender*.js',
	// 		(settings.isProduction ? '!' : '') + settings.assetsFolder + '/js/dev/*.js',
	// 		settings.assetsFolder + '/js/**/*.js',
	// 		settings.assetsFolder + '/js/*.js',
	// 		'!' + settings.assetsFolder + '/js/view-*.js',
	// 		'!**/_*.js'
	// 	];

	// 	if (settings.isProduction) {
	// 		var numFiles = deps.globule.find(files).length;
	// 		console.log(deps.chalk.green('✄  Concatenated ' + numFiles + ' JS files'));
	// 	}

	// 	// Process .js files
	// 	// Files are ordered for dependency sake
	// 	return deps.vfs.src(files, {base: '' + settings.assetsFolder + '/js'})
	// 		.pipe(deps.plumber())
	// 		.pipe(deps.deporder())
	// 		.pipe(deps.if(settings.isProduction, deps.stripDebug()))
	// 		.pipe(deps.if(settings.isProduction, deps.concat('core-libs.js')))
	// 		.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
	// 		.pipe(deps.if(settings.isProduction, deps.rename({extname: '.min.js'})))
	// 		.pipe(deps.if(settings.isProduction, deps.uglify()))
	// 		.pipe(deps.vfs.dest(settings.config.exportAssetsJs))
	// 	;
	// }
));
