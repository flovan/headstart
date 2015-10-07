'use strict';

// Require modules

var
	deps     = require('../../dependencies'),
	utils    = require('../../utils'),
	cli      = require('../../cli'),
	settings = require('../../settings'),

	conf     = settings.config
;

// Define tasks

deps.taker.task('sass', function (cb) {
	cli.toggleTaskSpinner('Processing sass');

	return deps.vfs.src(['src/**/sass/*.{css,sass,scss}'])

		// Catch possible errors down the stream
		.pipe(deps.plumber({errorHandler: utils.errorHandler}))

		// Compile sass
		.pipe(deps.sass(conf.dev.sassOptions)/*.on('error', deps.sass.logError)*/)

		// Hint if needed
		.pipe(deps.if(config.dev.hint, sasslint())) // .sassdocrc

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

		// .on('data', function (cb) {
		// 	// If revisioning is on, run templates again so the refresh contains
		// 	// the newer stylesheet
		// 	if (settings.lrStarted && settings.config.revisionCaching) {
		// 		deps.taker.series('templates')();
		// 	}
		// 	// Continue the stream
		// 	this.resume();
		// })
		//.pipe(deps.if(settings.lrStarted && !settings.config.revisionCaching, deps.browserSync.reload({stream:true})))
	;
});
