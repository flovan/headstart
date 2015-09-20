'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define task

deps.undertaker.task('manifest', function (cb) {
	// Quit this task if the revisions aren't turned on
	if (!settings.config.revisionCaching) {
		cb(null);
		return;
	}

	cli.toggleTaskSpinner('Generating manifest');

	return deps.fs.src([
		settings.config.exportAssetsJs + '/*',
		settings.config.exportAssetsCss + '/*'
	])
		.pipe(deps.plugins.manifest({
			filename: 'app.manifest',
			exclude:  'app.manifest'
		}))
		.pipe(deps.fs.dest(settings.config.exportMisc))
	;
});
