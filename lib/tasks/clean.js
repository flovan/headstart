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
	return deps.gulp.src([
			settings.config.export_templates,
			settings.config.export_assets
		], {read: false})
		.pipe(deps.plugins.rimraf({force: true}))
		.on('end', utils.updateBar)
	;
});

deps.gulp.task('clean-cwd', function (cb) {

	utils.verbose(deps.chalk.grey('Running task "clean-cwd"'));

	// Remove cwd files
	return deps.gulp.src(settings.cwd + '/*', {read: false})
		.pipe(deps.plugins.rimraf({force: true}))
	;
});

deps.gulp.task('clean-tmp', function (cb) {

	utils.verbose(deps.chalk.grey('Running task "clean-tmp"'));

	// Remove temp folder
	return deps.gulp.src(settings.tmpFolder, {read: false})
		.pipe(deps.plugins.rimraf({force: true}))
	;
});

deps.gulp.task('clean-rev', function (cb) {

	utils.verbose(deps.chalk.grey('Running task "clean-rev"'));

	// Clean all revision files but the latest ones
	return deps.gulp.src(settings.config.export_assets + '/assets/**/*.*', {read: false})
		.pipe(deps.plugins.revOutdated(1))
		.pipe(deps.plugins.rimraf({force: true}))
	;
});