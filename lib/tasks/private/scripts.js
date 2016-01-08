'use strict';

var deps       = require('../../dependencies');
var utils      = require('../../utils');
var cli        = require('../../cli');
var settings   = require('../../settings');
var sizeDiff   = require('../../sizediff');

var cond       = deps.if;
var conf       = settings.config;
var hint       = deps.lodash.contains(settings.global.get('hint'), 'Javascript');
var hintConfig = null;

// Define tasks

deps.taker.task('js-hint-config', function (cb) {
	// Quit early if the config has already been loaded or
	// hinting is not needed
	if (!hint || hintConfig !== null) {
		cb();
		return;
	}

	// If we don't have a hinting config yet
	// Try reading the .jshintrc file
	deps.fs.readFile('.jshintrc', 'utf8', function (err, data) {
		// Nothing to do here without a file
		if (err) {
			console.log(deps.chalk.yellow('⚠︎ Could not find ".jshintrc". Using default options.'));
			cb();
			return;
		}

		// Otherwise, try parsing it
		try {
			hintConfig = JSON.parse(data);

			// We'll be using a custom linter, so tell jshint not to do lookups
			hintConfig.lookup = false;
		} catch (err) {
			// Let the user know we can't use an invalid file
			console.log(deps.c.yellow('⚠︎ File ".jshintrc" is not valid json. Using default options.'));
		}

		cb();
	});
});

deps.taker.task('scripts', deps.taker.series('js-hint-config', function (cb) {
	console.log(deps.chalk.gray('Parsing scripts'));

	// Make a filter to handle non-view files differently
	var viewFilter = deps.filter(function (file) {
		return !/view\/.*/.test(file.path);
	}, {restore: true});

	// Clean out old files
	deps.del.sync(conf.dist.assets + '/' + conf.dist.scripts, { force: true });

	// Check if we need hinting
	if (hint) {
		// Do linting on non-third-party scripts
		deps.vfs.src([
			'src/**/*.js',
			'!**/lib/**/*',
			'!**/plugin/**/*',
			'!**/ie/**/*',
			'!**/_*.js'
		])
			.pipe(deps.jshint(hintConfig))
			.pipe(deps.jshint.reporter('jshint-stylish'))
		;
	}

	// Put other files through a stream
	return deps.vfs.src([
		'src/common/js/lib/*.js',
		'src/common/js/plugin/*.js',
		'src/common/**/*.js',
		'src/view/**/lib/**/*.js',
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

		// Strip out debug statements in production
		.pipe(cond(settings.isProduction && !settings.config.production.allowDebug, deps.stripDebug()))

		// Flatten the file structure
		.pipe(deps.flatten())

		// Filter out non-view files
		.pipe(viewFilter)

		// Concatenate them in production
		.pipe(cond(settings.isProduction, deps.concat(`${settings.config.production.concatName}.js`)))

		// Restore the stream
		.pipe(viewFilter.restore)

		// Rename the files in production
		.pipe(cond(settings.isProduction, deps.rename({suffix: '.min'})))

		// Uglify the files in production, and measure the size savings
		.pipe(cond(settings.isProduction, sizeDiff.start()))
		.pipe(cond(settings.isProduction, deps.uglify()))
		.pipe(cond(settings.isProduction, sizeDiff.stop()))

		// Write the files
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.scripts))

		// And finally cache them
		.pipe(deps.map(function (asset, cb) {
			utils.cacheAsset(asset.path, asset.analysis);
			cb(null, asset);
		}))
	;
}));
