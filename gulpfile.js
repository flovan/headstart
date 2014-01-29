// Load in all the plugins ----------------------------------------------------
//
// Note: Plumber fixes an issue with Node Stream piping
//		 -> https://gist.github.com/floatdrop/8269868

var gulp 			= require('gulp'),

    plumber 		= require('gulp-plumber'),
    connect			= require('connect'),
    http			= require('http'),
    open			= require('open'),
    gulpif			= require('gulp-if'),
    inject			= require('gulp-inject'),
    rimraf 			= require('gulp-rimraf'),
    jshint 			= require('gulp-jshint'),
    concat 			= require('gulp-concat'),
    uglify 			= require('gulp-uglify'),
    sass 			= require('gulp-ruby-sass'),
    autoprefixer 	= require('gulp-autoprefixer'),
    minifycss 		= require('gulp-minify-css'),
    imagemin 		= require('gulp-imagemin'),
    rename 			= require('gulp-rename'),
    cache 			= require('gulp-cache'),
    refresh 		= require('gulp-livereload'),
    tinylr			= require('tiny-lr'),
    livereload		= tinylr(),

    config			= {
				    	app: 	'app',
				    	dev:	'dev',
				    	dist: 	'dist',
				    	port:	9000,
				    	lr:		35729
				    };

// Catch CLI parameter

var isProduction = gulp.env.type === 'production';
console.log('isProduction: ' + isProduction);

// Clean up -------------------------------------------------------------------
//

gulp.task('clean', function()
{
	return gulp.src([config.dev, config.dist], {read: false})
		.pipe(plumber())
		.pipe(rimraf());
});

// Styles ---------------------------------------------------------------------
//

gulp.task('sass', function()
{
	return gulp.src(config.app + '/sass/*.scss')
		.pipe(plumber())
		.pipe(sass({ style: 'nested', compass: true }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulpif(isProduction, gulp.dest(config.dist + '/assets/css')))
		.pipe(gulpif(!isProduction, gulp.dest(config.dev + '/assets/css')))
		.pipe(gulpif(isProduction, refresh(livereload)));
});

// Scripts --------------------------------------------------------------------
//

gulp.task('lint-main', function()
{
	return gulp.src([
			config.app + '/js/app.js',
			config.app + '/js/core/*.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts-main', ['lint-main'], function()
{
	return gulp.src([
			config.app + '/js/libs/jquery*.js',
			config.app + '/js/libs/*.js',
			config.app + '/js/core/*.js',
			config.app + '/js/app.js'
		])
		.pipe(plumber())
		.pipe(gulpif(isProduction, concat('core-libs.min.js')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulpif(isProduction, gulp.dest(config.dist + '/assets/js')))
		.pipe(gulpif(!isProduction, gulp.dest(config.dev + '/assets/js')))
		.pipe(gulpif(isProduction, refresh(livereload)));
});

gulp.task('lint-view', function()
{
	return gulp.src(config.app + '/js/view/*.js')
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts-view', ['lint-view'], function()
{
	return gulp.src(config.app + '/js/view/*.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulpif(isProduction, gulp.dest(config.dist + '/assets/js/view')))
		.pipe(gulpif(!isProduction, gulp.dest(config.dev + '/assets/js/view')))
		.pipe(gulpif(isProduction, refresh(livereload)));
});

gulp.task('scripts-ie', function()
{
	return gulp.src([
			'**/html5shiv.js',
			'**/nwmatcher-1.2.5.js',
			'**/selectivizr.js',
			'**/matchmedia.polyfill.js',
			'**/matchmedia.addListener.js',
			'**/respond.js'
		])
		.pipe(plumber())
		.pipe(concat('ie.min.js'))
		.pipe(uglify())
		.pipe(gulpif(isProduction, gulp.dest(config.dist + '/assets/js')))
		.pipe(gulpif(!isProduction, gulp.dest(config.dev + '/assets/js')))
		.pipe(gulpif(isProduction, refresh(livereload)));
});

// Images ---------------------------------------------------------------------
//

gulp.task('images', function()
{
	return gulp.src(config.app + '/images/**/*')
		.pipe(plumber())
		.pipe(gulpif(isProduction, imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulpif(isProduction, gulp.dest(config.dist + '/assets/images')))
		.pipe(gulpif(!isProduction, gulp.dest(config.dev + '/assets/images')))
		.pipe(gulpif(isProduction, refresh(livereload)));
});

// Fonts ----------------------------------------------------------------------
//

gulp.task('fonts', function()
{
    return gulp.src(config.app + '/fonts/*')
        .pipe(gulpif(isProduction, gulp.dest(config.dist + 'assets/fonts')))
        .pipe(gulpif(!isProduction, gulp.dest(config.dev + 'assets/fonts')));
});

// Misc -----------------------------------------------------------------------
//
 
gulp.task('misc', function()
{
    return gulp.src(config.app + '/misc/*')
        .pipe(gulpif(isProduction, gulp.dest(config.dist)))
        .pipe(gulpif(!isProduction, gulp.dest(config.dev)));
});

// HTML -----------------------------------------------------------------------
//
 
gulp.task('html', function()
{ 
    return gulp.src(config.app + '/html/*')
        .pipe(gulpif(isProduction, gulp.dest(config.dist)))
        .pipe(gulpif(!isProduction, gulp.dest(config.dev)));
});

// LiveReload -----------------------------------------------------------------
//

gulp.task('connect-livereload', function()
{
    var middleware = [
        require('connect-livereload')({ port: config.lr }),
        connect.static(config.app),
        connect.directory(config.app)
    ];

    var app = connect.apply(null, middleware);

    var server = http.createServer(app);

    server
        .listen(config.port)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:' + config.port + '.');

            open('http://localhost:' + config.port);
        });
});

gulp.task('tinylr', function()
{
    livereload.listen(config.lr, function(err){
        if (err) {
            return console.log(err);
        }
    });
});

gulp.task('server', ['sass', 'connect-livereload', 'tinylr'], function()
{
    console.log('Started watching assets folder..')

	gulp.watch(config.app + '/sass/*.scss', ['sass'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});

	gulp.watch(config.app + '/**/*.js', ['scripts', 'scripts-view', 'scripts-ie'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  	});

	gulp.watch(config.app + '/images/**/*', ['images'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  	});
	/*
	gulp.watch(config.app + '/html/*', ['html'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  	});*/
});

// The default task -----------------------------------------------------------
//
// Runs when you call 'gulp' from the CLI

gulp.task('default', ['clean'], function()
{
	gulp.run('html', 'sass', 'fonts', 'misc', 'scripts-main', 'scripts-view', 'scripts-ie', 'images'/*, 'server'*/);
});


