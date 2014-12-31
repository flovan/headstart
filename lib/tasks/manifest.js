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

deps.gulp.task('manifest', function (cb) {
	
	// Quit this task if the revisions aren't turned on
	if (!settings.config.revisionCaching) {
		cb(null);
		return;
	}

	utils.toggleTaskSpinner('Generating manifest');

	return deps.gulp.src([
		settings.config.exportAssetsJs + '/*',
		settings.config.exportAssetsCss + '/*'
	])
		.pipe(deps.plugins.manifest({
			filename: 'app.manifest',
			exclude:  'app.manifest'
		}))
		.pipe(deps.gulp.dest(settings.config.exportMisc))
	;
});