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

	utils.verbose(deps.chalk.grey('Running task "clean-export"'));

	// Remove export folder and files
	deps.del([
		settings.config.export_templates,
		settings.config.export_assets
	], function () {
		utils.updateBar();
		cb();
	});
});

deps.gulp.task('clean-cwd', function (cb) {

	utils.verbose(deps.chalk.grey('Running task "clean-cwd"'));

	// Remove cwd files
	deps.del(settings.cwd + '/*', cb);
});

deps.gulp.task('clean-tmp', function (cb) {

	utils.verbose(deps.chalk.grey('Running task "clean-tmp"'));

	// Remove temp folder
	deps.del(settings.tmpFolder, cb);
});

deps.gulp.task('clean-rev', function (cb) {

	utils.verbose(deps.chalk.grey('Running task "clean-rev"'));

	// Clean all revision files but the latest ones
	return deps.gulp.src(settings.config.export_assets + '/assets/**/*.*', {read: false})
		.pipe(deps.plugins.revOutdated(1))
		.pipe(deps.vinylPaths(deps.del))
	;
});