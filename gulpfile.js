// Load in all the plugins ----------------------------------------------------
//
// Note: Plumber fixes an issue with Node Stream piping
//		 -> https://gist.github.com/floatdrop/8269868

var gulp 			= require('gulp'),

    plumber 		= require('gulp-plumber'),
    sass 			= require('gulp-ruby-sass'),
    autoprefixer 	= require('gulp-autoprefixer'),
    minifycss 		= require('gulp-minify-css'),
    uglify 			= require('gulp-uglify'),
    imagemin 		= require('gulp-imagemin'),
    rename 			= require('gulp-rename'),
    rimraf 			= require('gulp-rimraf'),
    concat 			= require('gulp-concat'),
    cache 			= require('gulp-cache'),
    livereload 		= require('gulp-livereload'),
    lr 				= require('tiny-lr'),
    server 			= lr();

// Clean up -------------------------------------------------------------------
//
// This task does the following things:
// - Clean out the dist folder before rebuilding

gulp.task('clean', function()
{
	return gulp.src(['dist'], {read: false})
		.pipe(plumber())
		.pipe(rimraf());
});

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
		.pipe(livereload(server));
});

// Scripts --------------------------------------------------------------------
//

gulp.task('scripts-main', function()
{
	return gulp.src(['assets/js/libs/jquery*.js', 'assets/js/libs/*.js', 'assets/js/core/*.js', 'assets/js/app.js'])
		.pipe(plumber())
		.pipe(concat('core-libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(livereload(server));
});

gulp.task('scripts-view', function()
{
	return gulp.src('assets/js/view/*.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js/view'))
		.pipe(livereload(server));
});

gulp.task('scripts-ie', function()
{
	return gulp.src(['**/html5shiv.js', '**/nwmatcher-1.2.5.js', '**/selectivizr.js', '**/matchmedia.polyfill.js', '**/matchmedia.addListener.js', '**/respond.js'])
		.pipe(plumber())
		.pipe(concat('ie.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(livereload(server));
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
		.pipe(livereload(server));
});

// Watch ----------------------------------------------------------------------
//
// Watch files for changes and run appropriate task

gulp.task('watch', function(cb)
{
	server.listen(35729, function(err)
	{
		if (err) { return console.log(err) };

		console.log('Started watching assets folder..')

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

	cb();
});

// The default task -----------------------------------------------------------
//
// Runs tasks in order when you call 'gulp' from the CLI

// TODO:
// Use dependencies instead of gulp.run()
// Not as easy as it seems though

gulp.task('default', ['clean'], function(cb)
{
	gulp.run('styles', 'scripts-main', 'scripts-view', 'scripts-ie', /*'images',*/ 'watch');
});


