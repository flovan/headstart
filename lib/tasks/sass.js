'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define variables

var
	sassSource = settings.assetsFolder + '/sass/*.{scss, sass, css}',
	ieSource = settings.assetsFolder + '/sass/ie*.{scss, sass, css}'
;

// Define tasks

deps.taker.task('sass', function (cb) {
	cli.toggleTaskSpinner('Compiling Sass');

	// Process the .scss files
	// While serving, this task opens a continuous watch
	return deps.fs.src([sassSource])
		.pipe(deps.if(!settings.config.compabilityMode, deps.exclude(ieSource)))
		.pipe(deps.plumber())
		.pipe(deps.if(settings.isRubySass, deps.rubySass({
			style: (settings.isProduction ? 'compressed' : 'nested')
		}), deps.sass({
			errLogToConsole: true
		})))
		.pipe(deps.if(settings.config.combineMediaQueries, deps.combineMediaQueries()))
		.pipe(deps.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		.pipe(deps.if(settings.isProduction, deps.minifyCss()))
		.pipe(deps.if(settings.isProduction, deps.rename({suffix: '.min'})))
		.pipe(deps.fs.dest(settings.config.exportAssetsCss))
		.on('data', function (cb) {
			cli.toggleTaskSpinner(false);

			// If revisioning is on, run templates again so the refresh contains
			// the newer stylesheet
			if (settings.lrStarted && settings.config.revisionCaching) {
				deps.taker.series('templates');
			}

			// Continue the stream
			this.resume();
		})
		.pipe(deps.if(settings.lrStarted && !settings.config.revisionCaching, deps.browserSync.reload({stream:true})))
	;
});
