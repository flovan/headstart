'use strict';

var
	deps     = require('../../dependencies'),
	utils    = require('../../utils'),
	cli      = require('../../cli'),
	settings = require('../../settings'),

	conf     = settings.config,
	jsFilter = deps.filter([
		'!**/lib/**/*',
		'!**/plugin/**/*',
		'!**/ie/**/*'
	], {restore: true})
;

// Define task
deps.taker.task('scripts', function (cb) {
	console.log(deps.chalk.gray('Parsing scripts'));

	// Clean out old files
	deps.del.sync(conf.dist.assets + '/' + conf.dist.scripts);

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
		.on('data', function (asset) {
			asset.analysis = utils.analyseAsset(asset);
			asset.path = (asset.analysis.isView ? asset.analysis.viewName + '-' : '') +
				deps.path.basename(asset.path);

			this.resume();
		})

		// Filter out custom files (ie. not libs or plugins)
		// and hint them if needed, then restore the stream
		.pipe(jsFilter)
		.pipe(deps.if(conf.dev.hint, deps.jshint()))
		.pipe(deps.if(conf.dev.hint, deps.jshint.reporter('jshint-stylish')))
		.pipe(jsFilter.restore)

		// Flatten the file structure
		.pipe(deps.flatten())

		// Write the files
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.scripts))

		// And finally cache them
		.on('data', function (asset) {
			utils.cacheAsset(asset.path, asset.analysis);
			this.resume();
		})
	;
});
