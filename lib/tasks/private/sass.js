'use strict';

var deps       = require('../../dependencies');
var utils      = require('../../utils');
var cli        = require('../../cli');
var settings   = require('../../settings');

var conf       = settings.config;
var hint       = deps.lodash.contains(settings.global.get('hint'), 'Sass');
var lintRules  = null;

// Define tasks

deps.taker.task('sass-lint-config', function (cb) {
	// Quit early if the config has already been loaded or
	// hinting is not needed
	if (!hint || lintRules !== null) {
		cb();
		return;
	}

	// If we don't have a hinting config yet
	// Try reading the .sasslintrc file
	deps.fs.readFile('.sasslintrc', 'utf8', function (err, data) {
		// Nothing to do here without a file
		if (err) {
			console.log(deps.chalk.yellow('⚠︎ Could not find ".sasslintrc". Using default options.'));
			cb();
			return;
		}

		// Otherwise, try parsing it
		try {
			lintRules = JSON.parse(data);
		} catch (err) {
			// Let the user know we can't use an invalid file
			console.log(deps.chalk.yellow('⚠︎ File ".sasslintrc" is not valid json. Using default options.'));
		}

		cb();
	});
});

deps.taker.task('sass', deps.taker.series('sass-lint-config', function (cb) {
	console.log(deps.chalk.gray('Processing sass'));

	// Clean out old files
	deps.del.sync(conf.dist.assets + '/' + conf.dist.styles);

	// Construct the stream
	return deps.vfs.src(['src/**/sass/*.{css,sass,scss}'])

		// Catch possible errors down the stream
		.pipe(deps.plumber({errorHandler: utils.errorHandler}))

		// Lint files if asked for
		.pipe(deps.if(hint, deps.sassLint({
			rules: lintRules,
			options: {
				'merge-default-rules': lintRules === null ? true : false,
				'formatter': 'stylish'
			},
			files: {
				include: '**/*.s+(a|c)ss'
			}
		})))
		.pipe(deps.if(hint, deps.sassLint.format()))
		//.pipe(deps.if(hint, deps.sassLint.failOnError()))

		// Compile sass
		.pipe(deps.sass(conf.dev.sassOptions)/*.on('error', deps.sass.logError)*/)

		// Run autoprefixer on top
		.pipe(deps.autoprefixer({ browsers: conf.dev.prefixBrowsers }))

		//.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		//.pipe(deps.if(settings.isProduction, deps.minifyCss(settings.config.dev.cssMinifyOptions)))
		//.pipe(deps.if(settings.isProduction, deps.rename({suffix: '.min'})))

		// Analyse the piped assets and, if part of a view,
		// change their filename
		.on('data', function (asset) {
			asset.analysis = utils.analyseAsset(asset);
			asset.path = (asset.analysis.isView ? asset.analysis.viewName + '-' : '') +
				deps.path.basename(asset.path);

			this.resume();
		})

		// Flatten the folder structure
		.pipe(deps.flatten())

		// Write the files
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.styles))

		// And finally cache them
		.on('data', function (asset) {
			utils.cacheAsset(asset.path, asset.analysis);
			this.resume();
		})

		// Reload if a server is running
		.on('end', function (asset) {
			if (!!settings.server && settings.server.active) {
				settings.server.reload('*.css');
			}
		})
	;
}));
