// REQUIRES -------------------------------------------------------------------

var
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	})
;

gulp.task('images', function (cb) {
	
	verbose(chalk.grey('Running task "images"'));

	// Make a copy of the favicon.png, and make a .ico version for IE
	// Move to root of export folder
	gulp.src('assets/images/icons/favicon.png')
		.pipe(plugins.rename({extname: '.ico'}))
		//.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(gulp.dest(config.export_misc))
	;

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	return gulp.src([
			'assets/images/**/*',
			'!_*'
		])
		.pipe(plugins.plumber())
		.pipe(plugins.newer(config.export_assets + '/assets/images'))
		.pipe(plugins.if(isProduction, plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		//.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(gulp.dest(config.export_assets + '/assets/images'))
		.pipe(plugins.if(lrStarted, browserSync.reload({stream:true})))
	;
});