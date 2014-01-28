// Load in all the plugins ----------------------------------------------------
//
// Note: Plumber fixes an issue with Node Stream piping
//		 -> https://gist.github.com/floatdrop/8269868

var gulp 			= require('gulp'),

    plumber 		= require('gulp-plumber'),
    sass 			= require('gulp-ruby-sass'),
    autoprefixer 	= require('gulp-autoprefixer'),
    minifycss 		= require('gulp-minify-css'),
    jshint 			= require('gulp-jshint'),
    uglify 			= require('gulp-uglify'),
    imagemin 		= require('gulp-imagemin'),
    rename 			= require('gulp-rename'),
    clean 			= require('gulp-clean'),
    concat 			= require('gulp-concat'),
    notify 			= require('gulp-notify'),
    cache 			= require('gulp-cache'),
    livereload 		= require('gulp-livereload'),
    lr 				= require('tiny-lr'),
    server 			= lr();

// Styles ---------------------------------------------------------------------
//
// This task does the following things:
// - Grab and compile all main .scss files
// - Auto-prefix results
// - Save and minify results to .css files
// - Reload browser

gulp.task('styles', function()
{
	return gulp.src('assets/sass/*.scss')
		.pipe(plumber())
		.pipe(sass({ style: 'nested', compass: true }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		//.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(livereload(server))
		.pipe(notify({ message: 'Styles task complete' }));
});

// Scripts --------------------------------------------------------------------
//
// This task does the following things:
// - Concatenate the libs and core files
// - Uglify, and save again as .min
// - Reload browser

gulp.task('scripts', function()
{
	gulp.src(['assets/js/libs/*.js', '!**/jquery*.js', 'assets/js/core/*.js', 'assets/js/app.js'])
		.pipe(plumber())
		.pipe(concat('core-libs.tmp.js'))
		.pipe(gulp.dest('dist/assets/js/tmp'));

	return gulp.src(['**/jquery*.js', '**/tmp/core-libs.tmp.js'])
		.pipe(plumber())
		//.pipe(jshint('.jshintrc'))
		//.pipe(jshint.reporter('default'))
		.pipe(concat('core-libs.js'))
		.pipe(rename({suffix: '.min'}))
		//.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(livereload(server))
		.pipe(notify({ message: 'Scripts task complete' }));
});

// IE -------------------------------------------------------------------------
//
// Same as scripts, but targeted for IE
// Note: Order is important!!!

gulp.task('ie-scripts', function()
{
	return gulp.src(['**/html5shiv.js', '**/nwmatcher-1.2.5.js', '**/selectivizr.js', '**/matchmedia.polyfill.js', '**/matchmedia.addListener.js', '**/respond.js'])
		.pipe(plumber())
		.pipe(concat('ie.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(livereload(server))
		.pipe(notify({ message: 'IE Scripts task complete' }));
});

// Images ---------------------------------------------------------------------
//
// This task does the following things:
// - Grab all images
// - Optimize them
// - Reload browser

gulp.task('images', function()
{
	return gulp.src('assets/images/**/*')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('dist/assets/images'))
		.pipe(livereload(server))
		.pipe(notify({ message: 'Images task complete' }));
});

// Clean up -------------------------------------------------------------------
//
// This task does the following things:
// - Clean out the dist folder before rebuilding

gulp.task('clean', function()
{
	return gulp.src(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], {read: false})
		.pipe(clean());
});

// The default task -----------------------------------------------------------
//
// Runs above tasks with dependency to clean

gulp.task('default', ['clean', 'styles', 'scripts', 'ie-scripts', 'images', 'watch'], function()
{
	gulp.src('dist/assets/js/tmp', {read: false})
		.pipe(clean());
});

// Watch ----------------------------------------------------------------------
//
// Watch files for changes and run appropriate task

gulp.task('watch', function()
{
	server.listen(35729, function(err)
	{
		if (err) { return console.log(err) };

		gulp.watch('assets/sass/*.scss', ['styles'], function(event)
		{
      		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    	});

		gulp.watch('assets/**/*.js', ['scripts, ie-scripts'], function(event)
		{
      		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      	});

		gulp.watch('assets/images/**/*', ['images'], function(event)
		{
      		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      	});
	});
});


