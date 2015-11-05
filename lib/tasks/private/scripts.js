'use strict';

var deps     = require('../../dependencies');
var utils    = require('../../utils');
var cli      = require('../../cli');
var settings = require('../../settings');

var conf     = settings.config;

// Define task
deps.taker.task('scripts', function (cb) {
	console.log(deps.chalk.gray('Parsing scripts'));

	// Clean out old files
	deps.del.sync(conf.dist.assets + '/' + conf.dist.scripts);

	// Do validation on non-third-party scripts
	deps.vfs.src([
		'src/**/*.js',
		'!**/lib/**/*',
		'!**/plugin/**/*',
		'!**/ie/**/*',
		'!**/_*.js'
	])
		.pipe(deps.if(conf.dev.hint, deps.jshint()))
		.pipe(deps.if(conf.dev.hint, deps.jshint.reporter('jshint-stylish')))

	// Put other files through a stream
	return deps.vfs.src([
		'src/common/js/lib/*.js',
		'src/common/js/plugin/*.js',
		'src/common/**/*.js',
		'src/view/**/*.js',
		'!**/_*.js'
	])
		// Catch possible errors down the stream
		.pipe(deps.plumber({errorHandler: utils.errorHandler}))

		// Analyse the piped assets and, if part of a view,
		// change their filename
		.pipe(deps.map(function (asset, cb) {
			asset.analysis = utils.analyseAsset(asset);
			asset.path = (asset.analysis.isView ? asset.analysis.viewName + '-' : '') +
				deps.path.basename(asset.path);
			cb(null, asset);
		}))

		// Flatten the file structure
		.pipe(deps.flatten())

		// Write the files
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.scripts))

		// And finally cache them
		.pipe(deps.map(function (asset, cb) {
			utils.cacheAsset(asset.path, asset.analysis);
			cb(null, asset);
		}))
	;
});
