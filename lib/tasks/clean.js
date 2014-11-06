'use strict';

// REQUIRES -------------------------------------------------------------------

var
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	}),
	utils               = require('./lib/utils')
;

gulp.task('clean-export', function (cb) {

	// Remove export folder and files
	return gulp.src([
			config.export_templates,
			config.export_assets + '/assets'
		], {read: false})
		.pipe(plugins.rimraf({force: true}))
		.on('end', updateBar)
	;
});

gulp.task('clean-cwd', function (cb) {

	// Remove cwd files
	return gulp.src(cwd + '/*', {read: false})
		.pipe(plugins.rimraf({force: true}))
	;
});

gulp.task('clean-tmp', function (cb) {

	// Remove temp folder
	return gulp.src(tmpFolder, {read: false})
		.pipe(plugins.rimraf({force: true}))
	;
});

gulp.task('clean-rev', function (cb) {

	verbose(chalk.grey('Running task "clean-rev"'));

	// Clean all revision files but the latest ones
	return gulp.src(config.export_assets + '/assets/**/*.*', {read: false})
		.pipe(plugins.revOutdated(1))
		.pipe(plugins.rimraf({force: true}))
	;
});