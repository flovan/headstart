// REQUIRES -------------------------------------------------------------------

var
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	})
;

gulp.task('manifest', function (cb) {
	
	// Quit this task if the revisions aren't turned on
	if (!config.revisionCaching) {
		updateBar();
		cb(null);
		return;
	}

	verbose(chalk.grey('Running task "manifest"'));

	return gulp.src([
		config.export_assets + '/assets/js/*',
		config.export_assets + '/assets/css/*'
	])
		.pipe(plugins.manifest({
			filename: 'app.manifest',
			exclude:  'app.manifest'
		}))
		.pipe(gulp.dest(config.export_misc))
		.on('end', updateBar)
	;
});