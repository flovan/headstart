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

deps.gulp.task('clean-export', function (cb) {

	utils.toggleTaskSpinner('Cleaning export folder');

	// Remove export folder and files
	deps.del([
		settings.config.exportTemplates,
		settings.config.exportAssets
	], cb);
});

deps.gulp.task('clean-cwd', function (cb) {

	utils.toggleTaskSpinner('Cleaning current directory');

	// Remove cwd files
	deps.del(settings.cwd + '/*', cb);
});

deps.gulp.task('clean-tmp', function (cb) {

	utils.toggleTaskSpinner('Removing temporary folder');

	// Remove temp folder
	deps.del(settings.tmpFolder, cb);
});

deps.gulp.task('clean-rev', function (cb) {

	utils.toggleTaskSpinner('Removing old file revisions');

	// Clean all revision files but the latest ones
	return deps.gulp.src(settings.config.exportAssets + '/' + settings.assetsFolder + '/**/*.*', {read: false})
		.pipe(deps.plugins.revOutdated(1))
		.pipe(deps.vinylPaths(deps.del))
	;
});