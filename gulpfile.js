/*
#
#	▒█░▒█ █▀▀ █▀▀█ ▒█▀▀▄ █▀▀ ▀▀█▀▀ █▀▀█ █▀▀█ ▀▀█▀▀ 
#	▒█▀▀█ █▀▀ █▄▄█ ▒█░▒█ ▀▀█ ░▒█░░ █▄▄█ █▄▄▀ ░▒█░░ 
#	▒█░▒█ ▀▀▀ ▀░░▀ ▒█▄▄▀ ▀▀▀ ░▒█░░ ▀░░▀ ▀░▀▀ ░▒█░░ 
#
# 	A easy-to-use Gulp framework/boilerplate/template/whatever.
#	➳  https://github.com/flovan/Headstart
#
*/

"use strict";

// Uncomment if you want a full error stack
// Error.stackTraceLimit = Infinity;

// Load in all the plugins ----------------------------------------------------
//

var 	path 			= require('path')
    ,	connect			= require('connect')
    ,	http			= require('http')
    ,	open			= require('open')
    ,	lr				= require('tiny-lr')()

	,	gulp 			= require('gulp')
	,	gulputil		= require('gulp-util')
    ,	gulpif			= require('gulp-if')
    ,	include			= require('gulp-ignore').include
    ,	tap				= require('gulp-tap')
    ,	inject			= require('gulp-inject')
    ,	rimraf 			= require('gulp-rimraf')
    ,	htmlmin			= require('gulp-minify-html')
    ,	jshint 			= require('gulp-jshint')
    ,	concat 			= require('gulp-concat')
    ,	uglify 			= require('gulp-uglify')
    ,	sass 			= require('gulp-ruby-sass')
    ,	autoprefixer 	= require('gulp-autoprefixer')
    ,	cssmin	 		= require('gulp-minify-css')
    ,	cache 			= require('gulp-cache')
    ,	imagemin 		= require('gulp-imagemin')
    ,	rename 			= require('gulp-rename')
    ,	refresh 		= require('gulp-livereload')
    ,	embedlr 		= require('gulp-embedlr')

   	,	config			= {
   							// Personal settings

					    		browser:		'google chrome'
					    	,	defaultPage:	'index.html'
					    	,	openAllFiles:	false

					    	// App settings
					    	// Can can, but should not mess with these :)

					    	,	app: 			'app'
					    	,	dev:			'dev'
					    	,	dist: 			'dist'
					    	,	temp:			'.temp'
					    	,	port:			9000
					    	,	lr:				35729
					    }

// Catch CLI parameter

var isProduction = gulputil.env.dist === true;

// Clean up -------------------------------------------------------------------
//

gulp.task('clean', function()
{
	return gulp.src([isProduction ? config.dist : config.dev, config.temp], {read: false})
		.pipe(rimraf());
});

// Styles ---------------------------------------------------------------------
//

gulp.task('sass', function()
{
	return gulp.src(config.app + '/sass/*.scss')
		.pipe(sass({ style: 'nested', compass: true }))
		//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssmin())
		.pipe(gulpif(isProduction, gulp.dest(config.dist + '/css')))
		.pipe(gulpif(!isProduction, gulp.dest(config.dev + '/css')))
		.pipe(gulpif(!isProduction, refresh(lr)))
});

// Scripts --------------------------------------------------------------------
//

gulp.task('lint-main', function()
{
	return gulp.src([
			config.app + '/js/app.js',
			config.app + '/js/core/*.js',
			'!' + config.app + '/js/**/log.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts-main', ['lint-main'], function()
{
	return gulp.src([
				config.app + '/js/libs/jquery*.js'
			,	config.app + '/js/libs/*.js'
			,	config.app + '/js/core/*.js'
			,	config.app + '/js/app.js'
		])
		.pipe(gulpif(isProduction, concat('core-libs.min.js')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/js'))
		.pipe(gulpif(!isProduction, refresh(lr)));
});

gulp.task('lint-view', function()
{
	return gulp.src(config.app + '/js/view-*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts-view', ['lint-view'], function()
{
	gulp.src(config.app + '/js/view-*.js')
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/js'))
		.pipe(gulpif(!isProduction, refresh(lr)));
});

gulp.task('scripts-ie', function()
{
	return gulp.src([
				config.app + '/js/libs/ie/html5shiv.js'
			,	config.app + '/js/libs/ie/PIE.js'
			,	config.app + '/js/libs/ie/nwmatcher-1.2.5.js'
			,	config.app + '/js/libs/ie/selectivizr.js'
			,	config.app + '/js/libs/ie/matchmedia.polyfill.js'
			,	config.app + '/js/libs/ie/matchmedia.addListener.js'
			,	config.app + '/js/libs/ie/respond.js'
		])
		.pipe(concat('ie.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/js'))
		.pipe(gulpif(!isProduction, refresh(lr)));
});

// Images ---------------------------------------------------------------------
//
// TODO: Try to get rid of the EmitterEvent memory leak
// ~ commented in 'default' task

gulp.task('images', function()
{
	return gulp.src([
				config.app + '/images/**/*.jpg'
			,	config.app + '/images/**/*.png'
			,	config.app + '/images/**/*.gif'
		])
		.pipe(gulpif(isProduction, cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/images'))
		.pipe(gulpif(!isProduction, refresh(lr)));
});

// Fonts ----------------------------------------------------------------------
//

gulp.task('fonts', function()
{
    return gulp.src(config.app + '/fonts/*')
        .pipe(gulp.dest((isProduction ? config.dist : config.dev) + 'assets/fonts'));
});

// Misc -----------------------------------------------------------------------
//
 
gulp.task('misc', function()
{
    return gulp.src(config.app + '/misc/htaccess.txt')
		.pipe(rename('.htaccess'))
		.pipe(gulpif(isProduction, include(config.app + '/misc/*')))
        .pipe(gulp.dest((isProduction ? config.dist : config.dev)));
});

// HTML -----------------------------------------------------------------------
//
 
gulp.task('html', ['scripts-view', 'scripts-main', 'sass'], function(cb)
{
	gulp.src(config.app + '/html/*.html')
		.pipe(tap(function(htmlFile, t)
		{
			// Make a clone of the core and lib files array and include the view file
			// that matches the current .html file

			var jsSource = isProduction ? [config.dist + '/js/core-libs.min.js'] : [
					config.app + '/js/libs/jquery*.js'
				,	config.app + '/js/libs/*.js'
				,	config.app + '/js/core/*.js'
				,	config.app + '/js/app.js'
			];
			jsSource.push((isProduction ? config.dist : config.dev ) + '/js/view-' + path.basename(htmlFile.path).split('.')[0] + (isProduction ? '.min' : '') + '.js');

			// Grab js files
			return gulp.src(jsSource)
				// Rewrite path names as folder structure is lost outside of the app folder
				.pipe(tap(function(file, t)
				{
					file.path = (isProduction ? config.dist : config.dev ) + '/js/' + path.basename(file.path);
				}))
				// Inject ordered js files into each .html file
				.pipe(inject(config.app + '/html/' + path.basename(htmlFile.path), {
		    			addRootSlash: false
		    		,	starttag: '<!-- inject_js -->'
		    		,	ignorePath: ['/app/', 'dev/', 'dist/']
	    		}))
				.pipe(gulp.dest(config.temp))
				// Tap into this generated .html file
				.pipe(tap(function(viewFile, t)
				{
					// Grab and nject css files into the temp .html file
					gulp.src([
								(isProduction ? config.dist : config.dev ) + '/css/common.min.css'
							,	(isProduction ? config.dist : config.dev ) + '/css/view-' + path.basename(viewFile.path).split('.')[0] + '.min.css'
						])
						.pipe(inject(config.temp + '/' + path.basename(viewFile.path), {
				    			addRootSlash: false
				    		,	starttag: '<!-- inject_css -->'
				    		,	ignorePath: ['/dev/', '/dist/']
			    		}))
	    				.pipe(embedlr())
			    		.pipe(gulpif(isProduction, htmlmin()))
						.pipe(gulp.dest(isProduction ? config.dist : config.dev));
				}));
		
		}));

    cb();
});

// lr -----------------------------------------------------------------
//

gulp.task('connect-livereload', function()
{
    var middleware = [
        require('connect-livereload')({ port: config.lr }),
        connect.static(config.dev),
        connect.directory(config.dev)
    ];
 
    var app = connect.apply(null, middleware);
 
    var server = http.createServer(app);
 
    server
        .listen(config.port)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:' + config.port + '.');
 			
 			// Open the default .html file in the browser
            if(!config.openAllFiles) open('http://localhost:' + config.port + '/' + config.defaultPage, config.browser);
            // or open ALL the files
            else
            {
            	gulp.src(config.app + '/html/*.html')
            		.pipe(tap(function(htmlFile, t)
            		{
            			open('http://localhost:' + config.port + '/' + path.basename(htmlFile.path), config.browser);
            		}));
            }
        });
});
 
gulp.task('tinylr', function()
{
    lr.listen(config.lr, function(err){
        if (err) {
            return console.log(err);
        }
    });
});

gulp.task('server', ['sass', 'scripts-main', 'scripts-view', 'scripts-ie', 'images', 'html'], function()
{
	gulp.start('connect-livereload', 'tinylr');

    gulp.watch(config.app + '/sass/*.scss', function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('sass');
	});

	gulp.watch(config.app + '/**/*.js', ['scripts-main', 'scripts-view', 'scripts-ie'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('scripts-main', 'scripts-view', 'scripts-ie');
  	});

	gulp.watch(config.app + '/images/**/*', ['images'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('images');
  	});
	
	gulp.watch(config.app + '/html/*', ['html'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('html');
  	});
});

// The default task -----------------------------------------------------------
//
// Runs when you call 'gulp' from the CLI

gulp.task('default', ['clean'], function()
{
	gulp.start('sass', 'scripts-view', 'scripts-main', 'scripts-ie', 'fonts', 'images', 'misc', 'html');
	if(!isProduction) gulp.start('server');
});


