'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define Gulp tasks

deps.gulp.task('clean-export', function (cb) {
	cli.toggleTaskSpinner('Cleaning export folder');

	// Remove export folder and files
	deps.del([
		settings.config.exportTemplates,
		settings.config.exportAssets
	], cb);
});

deps.gulp.task('clean-cwd', function (cb) {
	cli.toggleTaskSpinner('Cleaning current directory');

	// Remove cwd files
	deps.del(settings.cwd + '/*', cb);
});

deps.gulp.task('clean-tmp', function (cb) {
	cli.toggleTaskSpinner('Removing temporary folder');

	// Remove temp folder
	deps.del(settings.tmpFolder, cb);
});

deps.gulp.task('clean-rev', function (cb) {
	cli.toggleTaskSpinner('Removing old file revisions');

	// Clean all revision files but the latest ones
	return deps.gulp.src(settings.config.exportAssets + '/' + settings.assetsFolder + '/**/*.*', {read: false})
		.pipe(deps.plugins.revOutdated(1))
		.pipe(deps.vinylPaths(deps.del))
	;
});