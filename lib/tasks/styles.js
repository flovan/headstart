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
	preprocData = settings.global.get('preProcessor'),
	preprocName = preprocData.name,
	preprocNameLower = preprocName.toLowerCase(),
	preprocSettings,
	preproc,
	ieSource = settings.assetsFolder + '/' + preprocNameLower + '/ie*.{' + preprocData.extension + '}',
	prefixerSettings
;

// Define tasks

deps.taker.task('styles', function (cb) {
	// With no ruby flag, or a flag but no settings,
	// take the "regular" preprocessor; otherwise,
	// grab its "ruby-" alternative and settings.
	if (!settings.isRuby || settings.isRuby && !preprocData.settings.ruby) {
		preproc = deps[preprocNameLower];
		preprocSettings = preprocData.settings.regular;
	} else {
		preprocName = 'ruby' + preprocName;
		preproc = deps[preprocName];
		preprocSettings = preprocData.settings.ruby;
	}

	process.nextTick(function() {
		cli.toggleTaskSpinner('Processing styles with ' + preprocName);
	});

	var debug = require('gulp-debug');

	// Process the style files
	return deps.vfs.src([
		settings.assetsFolder + '/' + preprocNameLower + '/*.{' + preprocData.extension + '}',
		'!_*.{' + preprocData.extension + '}'
	])
		.pipe(deps.if(!settings.isCompat, deps.exclude(ieSource)))
		.pipe(deps.plumber())
		//.pipe(debug())
		//.pipe(deps.sourcemaps.init())
			.pipe(preproc(preprocSettings))
			//.pipe(deps.if(settings.config.combineMediaQueries, deps.combineMediaQueries()))
			//.pipe(deps.autoprefixer({ browsers: settings.prefixBrowsers }))
			//.pipe(deps.if(settings.config.revisionCaching, deps.rev()))
			//.pipe(deps.if(settings.isProduction, deps.minifyCss()))
		//.pipe(deps.sourcemaps.write(settings.config.exportAssetsCss))
		//.pipe(deps.if(settings.isProduction, deps.rename({suffix: '.min'})))
		.pipe(deps.vfs.dest(settings.config.exportAssetsCss))
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
