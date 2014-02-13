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

// Load in all the plugins ----------------------------------------------------
//

var 	path 			= require('path')
    ,	connect			= require('connect')
    ,	http			= require('http')
    ,	open			= require('open')
    ,	lr				= require('tiny-lr')()
    ,	ask				= require('inquirer').prompt

	,	gulp 			= require('gulp')
	,	gulputil		= require('gulp-util')
    ,	gulpif			= require('gulp-if')
    ,	include			= require('gulp-ignore').include
    ,	tap				= require('gulp-tap')
    ,	inject			= require('gulp-inject')
    ,	rimraf 			= require('gulp-rimraf')
    ,	htmlmin			= require('gulp-minify-html')
    ,	jshint 			= require('gulp-jshint')
    ,	stylish			= require('jshint-stylish')
    ,	concat 			= require('gulp-concat')
    ,	replace			= require('gulp-replace')
    ,	uglify 			= require('gulp-uglify')
    ,	sass 			= require('gulp-ruby-sass')
    ,	autoprefixer 	= require('gulp-autoprefixer')
    ,	cssmin	 		= require('gulp-minify-css')
    ,	cache 			= require('gulp-cache')
    ,	imagemin 		= require('gulp-imagemin')
    ,	svgmin			= require('gulp-svgmin')
    ,	rename 			= require('gulp-rename')
    ,	refresh 		= require('gulp-livereload')
    ,	embedlr 		= require('gulp-embedlr')
    ,	zip				= require('gulp-zip')

   	,	lrStarted		= false
   	,	config			= {

		// Personal settings --------------------------------------------------
		//
		// Adjust these to your needs

    		browser:		'google chrome'
    	,	defaultPage:	'index.html'
    	,	openAllFiles:	false

    	// App settings -------------------------------------------------------
    	//
    	// You can, but should not mess with these :)

    	,	app: 			'app'
    	,	dev:			'dev'
    	,	dist: 			'dist'
    	,	temp:			'.temp'
    	,	port:			9000
    	,	lr:				35729
    };

// Catch CLI parameter
//
// When 'gulp' is run with --dist as parameter, the process is kicked into
// production mode

var isProduction = gulputil.env.dist === true;

// Clean up -------------------------------------------------------------------
//
// Removes the dev/dist folder and its files

gulp.task('clean', function()
{
	return gulp.src([isProduction ? config.dist : config.dev, config.temp], {read: false})
		.pipe(rimraf());
});

// Styles ---------------------------------------------------------------------
//
// Compiles and minifies the .scss files
// Note: Autoprefixer is included but not used, as I prefer Compass mixins

gulp.task('sass', function()
{
	return gulp.src(config.app + '/sass/*.scss')
		.pipe(sass({ style: 'nested', compass: true }))
		//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssmin())
		.pipe(gulpif(isProduction, gulp.dest(config.dist + '/css')))
		.pipe(gulpif(!isProduction, gulp.dest(config.dev + '/css')))
		.pipe(gulpif((!isProduction && lrStarted), refresh(lr)));
});

// Hinting --------------------------------------------------------------------
//
// Making sure your scripts are squeaky-clean, settings in '.jshintrc' file
//
// Note:	Before running production it is advised to insert following option:
// 			"undef": true
//
//			It is not included by default because it also throws errors on
//			global variables such as "window" and "document".

gulp.task('hint-main', function()
{
	return gulp.src([
			config.app + '/js/app.js',
			config.app + '/js/core/*.js',
			'!' + config.app + '/js/**/log.js'
		])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish));
});

gulp.task('hint-view', function()
{
	return gulp.src(config.app + '/js/view-*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish));
});

// Scripts --------------------------------------------------------------------
//
// Concatinating and uglifying
// Also strips out all references to console.log() or log()

gulp.task('scripts-main', ['hint-main'], function()
{
	return gulp.src([
				config.app + '/js/libs/jquery*.js'
			,	config.app + '/js/libs/*.js'
			,	'!' + config.app + '/js.libs.'
			,	config.app + '/js/core/*.js'
			,	(isProduction ? '!**/log.js' : '')
			,	config.app + '/js/app.js'
		])
		.pipe(gulpif(isProduction, concat('core-libs.min.js')))
		.pipe(gulpif(isProduction, replace(/(console\.)?log(.*?);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/js'))
		.pipe(gulpif((!isProduction && lrStarted), refresh(lr)));
});

gulp.task('scripts-view', ['hint-view'], function()
{
	gulp.src(config.app + '/js/view-*.js')
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulpif(isProduction, replace(/(console\.)?log(.*?);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/js'))
		.pipe(gulpif((!isProduction && lrStarted), refresh(lr)));
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
		.pipe(gulpif((!isProduction && lrStarted), refresh(lr)));
});

// Images ---------------------------------------------------------------------
//
// Optimizes your images and svg files

gulp.task('images', function(cb)
{
	gulp.src([
				config.app + '/images/**/*.jpg'
			,	config.app + '/images/**/*.png'
			,	config.app + '/images/**/*.gif'
		])
		.pipe(gulpif(isProduction, cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/images'))
		.pipe(gulpif((!isProduction && lrStarted), refresh(lr)));

	gulp.src(config.app + '/images/**/*.svg')
		.pipe(gulpif(isProduction, svgmin()))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev) + '/images'))
		.pipe(gulpif((!isProduction && lrStarted), refresh(lr)));

	cb(null);
});

// Fonts ----------------------------------------------------------------------
//
// Copies the font files over

gulp.task('fonts', function()
{
    return gulp.src(config.app + '/fonts/*')
        .pipe(gulp.dest((isProduction ? config.dist : config.dev) + 'assets/fonts'));
});

// Misc -----------------------------------------------------------------------
//
// Maked the .htaccess work, copy over the other misc files in production mode
 
gulp.task('misc', function(cb)
{
	gulp.src(config.app + '/misc/htaccess.txt')
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest((isProduction ? config.dist : config.dev)));

	if(isProduction)
	{
		gulp.src([config.app + '/misc/*', '!**/htaccess.txt'])
			.pipe(gulp.dest(config.dist));
	}

    cb(null);
});

// HTML -----------------------------------------------------------------------
//
// Places links to correct assets in all the .html files and minify
 
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
			    		.pipe(gulpif(isProduction, htmlmin({ comments: true })))
						.pipe(gulp.dest(isProduction ? config.dist : config.dev));
				}));
		
		}));

    cb(null);
});

// Livereloading --------------------------------------------------------------
//
// Sets up a livereload server, and opens files in the browser

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
            lrStarted = true;
 			
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

    gulp.watch(config.app + '/sass/*.scss', ['connect-livereload', 'tinylr'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('sass');
	});

	gulp.watch(config.app + '/**/*.js', ['connect-livereload', 'tinylr'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('scripts-main', 'scripts-view', 'scripts-ie');
  	});

	gulp.watch(config.app + '/images/**/*', ['connect-livereload', 'tinylr'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('images');
  	});
	
	gulp.watch(config.app + '/html/*', ['connect-livereload', 'tinylr'], function(event)
	{
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  		gulp.start('html');
  	});
});

// Zipping --------------------------------------------------------------------
//
// Zips up the production folder is wanted (via prompt)

gulp.task('zip', ['sass', 'scripts-main', 'scripts-view', 'scripts-ie', 'images', 'html'], function(cb)
{
	cb(null);

	ask({
			type: 'confirm'
		,	message: 'Would to like to have this zipped up?'
		,	name: 'zip'
		,	default: true

	}, function(answer)
	{
		if(answer.zip)
		{
			gulp.src([config.dist + '/**/*', config.dist + '/.htaccess'])
				.pipe(zip('Archive.zip'))
				.pipe(gulp.dest(config.dist));

			console.log('Made Archive.zip at ./' + config.dist);
		}
	});
});

// The default task -----------------------------------------------------------
//
// Runs when you call 'gulp' from the CLI

gulp.task('default', ['clean'], function()
{
	gulp.start('sass', 'scripts-view', 'scripts-main', 'scripts-ie', 'fonts', 'images', 'misc', 'html');
	if(!isProduction) gulp.start('server');
	else gulp.start('zip')
});


