(function(){

/*
#
#	▒█░▒█ █▀▀ █▀▀█ ▒█▀▀▄ █▀▀ ▀▀█▀▀ █▀▀█ █▀▀█ ▀▀█▀▀ 
#	▒█▀▀█ █▀▀ █▄▄█ ▒█░▒█ ▀▀█ ░▒█░░ █▄▄█ █▄▄▀ ░▒█░░ 
#	▒█░▒█ ▀▀▀ ▀░░▀ ▒█▄▄▀ ▀▀▀ ░▒█░░ ▀░░▀ ▀░▀▀ ░▒█░░ 
#
#	An easy to use, worry-free framework/boilerplate/template/whatever.
#	➳  https://github.com/flovan/headstart
#
*/

'use strict';

// Load in all the plugins ----------------------------------------------------
//

var		path			= require('path')
	,	ask				= require('inquirer').prompt
	,	sequence		= require('run-sequence')

	,	gulp			= require('gulp')
	,	gulputil		= require('gulp-util')
	,	gulpif			= require('gulp-if')
	,	tap				= require('gulp-tap')
	,	inject			= require('gulp-inject')
	,	rimraf			= require('gulp-rimraf')
	,	newer			= require('gulp-newer')
	,	watch			= require('gulp-watch')
	,	plumber			= require('gulp-plumber')
	,	htmlmin			= require('gulp-minify-html')
	,	htmlhint		= require('gulp-htmlhint')
	,	jshint			= require('gulp-jshint')
	,	stylish			= require('jshint-stylish')
	,	concat			= require('gulp-concat')
	,	replace			= require('gulp-replace')
	,	uglify			= require('gulp-uglify')
	//,	sass			= require('gulp-sass')
	,	sass			= require('gulp-ruby-sass')
	,	sassgraph		= require('gulp-sass-graph')
	,	autoprefixer	= require('gulp-autoprefixer')
	,	cache			= require('gulp-cache')
	,	imagemin		= require('gulp-imagemin')
	,	svgmin			= require('gulp-svgmin')
	,	rename			= require('gulp-rename')
	,	connect			= require('gulp-connect')
	,	zip				= require('gulp-zip')

	,	lrStarted		= false
	,	config			= {

		// Personal settings --------------------------------------------------
		//
		// Adjust these to your needs

			// Your favorite browser
			// OS X: Google Chrome, Linux: google-chrome, Windows: chrome
			browser:		'Google Chrome'

			// The default page to open in the browser
		,	defaultPage:	'index.html'

			// Will open all the HTML files in the browser; overrides defaultPage
		,	openAllFiles:	false

			// Will turn off livereload when false
			// Handy for IE testing through http://my.ip.address:port as livereload blocks page
		,	useLR:			true

			// Will minify HTML when true; should be avoided for back-end integration
		,	minifyHTML:		false

			// Will enable auto-prefixing when true
		,	autoPrefix:		true

			// Will enable hinting of your files
			// Change settings in .htmlhintrc and .jshintrc
		,	hint:			true

		// App settings -------------------------------------------------------
		//
		// You can, but should not mess with these :)

		,	app:			'app'
		,	dev:			'dev'
		,	dist:			'dist'
		,	port:			9000
		,	lr:				35729
	};

// Catch CLI parameter
//
// --dist
//
// By using 'gulp -- dist', the process is kicked into production mode
// Will produce a 'dist' folder with production-ready files

var 	isProduction = gulputil.env.dist === true
	,	runDir = (isProduction ? config.dist : config.dev);

// Error handler
//
// Errors from sass or autoprefix can stop the Gulp process.
// By catching and processing them this can be fixed.

function handleError(err)
{
	console.log(err.toString());
	this.emit('end');
}

// Clean up -------------------------------------------------------------------
//
// Removes the dev/dist folder and its files

gulp.task('clean', function()
{
	return gulp.src(runDir, {read: false})
		.pipe(rimraf());
});

// Styles ---------------------------------------------------------------------
//
// Compiles and minifies the .scss files
// Will only run once — at the beginning

gulp.task('sass', function()
{
	return gulp.src(config.app + '/sass/*.scss')
		//.pipe(plumber())
		//.pipe(sass({ outputStyle: (isProduction ? 'compressed' : 'nested'), errLogToConsole: true }))
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(sass({ style: (isProduction ? 'compressed' : 'nested') }))
		.pipe(gulpif(config.autoPrefix, autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')))
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulp.dest(runDir + '/css'));
});

// Hinting --------------------------------------------------------------------
//
// Making sure your scripts are squeaky-clean, settings in '.jshintrc' file
//
// Note:	Before running production it is advised to insert following option:
//			"undef": true
//
//			It is not included by default because it also throws errors on
//			global variables such as "window" and "document".

gulp.task('hint-html', function(cb)
{
	if(!config.hint) cb(null);
	else return gulp.src(config.app + '/html/*.html')
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter(stylish));
});

gulp.task('hint-main', function(cb)
{
	if(!config.hint) cb(null);
	else return gulp.src([
				config.app + '/js/app.js'
			,	config.app + '/js/core/*.js'
			,	'!' + config.app + '/js/**/log.js'
		])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish));
});

gulp.task('hint-view', function(cb)
{
	if(!config.hint) cb(null);
	else return gulp.src(config.app + '/js/view-*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish));
});

// Scripts --------------------------------------------------------------------
//
// Concatinating and uglifying
// Also strips out all references to console.log() or log()
//
// JSHint options:	http://www.jshint.com/docs/options/
// HTMLHint option:	https://github.com/yaniswang/HTMLHint/wiki/Rules

gulp.task('scripts-main', ['hint-main'], function()
{
	return gulp.src([
				config.app + '/js/libs/jquery*.js'
			,	config.app + '/js/libs/*.js'
			,	(isProduction ? '!**/log.js' : '')
			,	config.app + '/js/core/*.js'
			,	config.app + '/js/app.js'
		], {base: './' + config.app + '/js'})
		.pipe(gulpif(isProduction, concat('core-libs.min.js')))
		.pipe(gulpif(isProduction, replace(/(console\.)?log(.*?);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest(runDir + '/js'));
});

gulp.task('scripts-view', ['hint-view'], function()
{
	return gulp.src(config.app + '/js/view-*.js')
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulpif(isProduction, replace(/(console\.)?log(.*?);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest(runDir + '/js'));
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
			,	config.app + '/js/libs/ie/*.js'
		])
		.pipe(concat('ie.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(runDir + '/js'));
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
		.pipe(newer(runDir + '/images'))
		.pipe(gulpif(isProduction, cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))))
		.pipe(gulp.dest(runDir + '/images'))
		.pipe(gulpif(lrStarted && config.useLR, connect.reload()));

	gulp.src(config.app + '/images/**/*.svg')
		.pipe(newer(runDir + '/images'))
		.pipe(gulpif(isProduction, svgmin()))
		.pipe(gulp.dest(runDir + '/images'))
		.pipe(gulpif(lrStarted && config.useLR, connect.reload()));

	cb(null);
});

// Fonts ----------------------------------------------------------------------
//
// Copies the font files over

gulp.task('fonts', function()
{
	return gulp.src(config.app + '/fonts/*')
		.pipe(newer(runDir + '/fonts'))
		.pipe(gulp.dest(runDir + '/fonts'))
		.pipe(gulpif(lrStarted && config.useLR, connect.reload()));;
});

// Misc -----------------------------------------------------------------------
//
// Maked the .htaccess work, copy over the other misc files in production mode
 
gulp.task('misc', function(cb)
{
	gulp.src(config.app + '/misc/htaccess.txt')
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest(runDir));

	if(isProduction)
	{
		gulp.src([config.app + '/misc/*', '!**/htaccess.txt'])
			.pipe(gulp.dest(config.dist));
	}

    cb(null);
});

// HTML -----------------------------------------------------------------------
//
// Inject links to correct assets in all the .html files
// Add livereload tag in development
// Minify in production
//
// Note:
// HTML comments are being left in for the purpose of having conditional statements.
// Perhaps this could be made optional through the config setting.
 
gulp.task('html', ['hint-html'], function(cb)
{
	gulp.src(config.app + '/html/*.html')
		.pipe(tap(function(htmlFile)
		{
			// Production will get 1 file only
			// Development gets raw base files
			var injectItems = isProduction ? [config.dist + '/js/core-libs.min.js'] : [
						config.app + '/js/libs/jquery*.js'
					,	config.app + '/js/libs/*.js'
					,	(isProduction ? '!**/log.js' : '')
					,	config.app + '/js/core/*.js'
					,	config.app + '/js/app.js'
				];

			// Add specific js and css files
			var viewSpecificName = 'view-' + path.basename(htmlFile.path).split('.')[0] + (isProduction ? '.min' : '');
			injectItems.push(runDir + '/js/' + viewSpecificName + '.js');
			injectItems.push(runDir + '/css/common' + (isProduction ? '.min' : '') + '.css')
			injectItems.push(runDir + '/css/' + viewSpecificName + '.css');

			// Inject files into the HTML file
			gulp.src(config.app + '/html/' + path.basename(htmlFile.path))
				.pipe(inject(gulp.src(injectItems, {read: false}), {
						ignorePath: ['/dev', '/app', '/dist']
					,	addRootSlash: false
				}))
				.pipe(gulpif(isProduction && config.minifyHTML, htmlmin()))
				.pipe(gulp.dest(runDir))
				.pipe(gulpif(lrStarted && config.useLR, connect.reload()));
		}));

	cb(null);
});

// Livereloading --------------------------------------------------------------
//
// Sets up a livereload server, and opens files in the browser

gulp.task('connect-livereload', connect.server({
			root: [config.dev]
		,	port: config.port
		,	livereload: true
		,	open: {
				file: config.defaultPage,
				browser: config.browser
		}
}));

gulp.task('server', function()
{
	// Startup the livereload server and connect to it
	sequence('connect-livereload', function()
	{
		lrStarted = true;
	});

	// SCSS specific watch
	// Note: Compilation is repeated here so the process can work with single files (= faster)
	watch({ glob: config.app + '/sass/**/*.scss', emitOnGlob: false, name: 'SCSS' })
		//.pipe(plumber())
		//.pipe(sassgraph([config.app + '/sass']))
		//.pipe(sass({ outputStyle: (isProduction ? 'compressed' : 'nested'), errLogToConsole: true }))
		.pipe(sassgraph([config.app + '/sass']))
		.on('data', function(file)
		{
			gulp.src(file.path)
				.pipe(plumber({ errorHandler: handleError }))
				.pipe(sass({ style: (isProduction ? 'compressed' : 'nested') }))
				.pipe(gulpif(config.autoPrefix, autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')))
				.pipe(gulpif(isProduction, rename({suffix: '.min'})))
				.pipe(gulp.dest(runDir + '/css'))
				.pipe(gulpif(lrStarted && config.useLR, connect.reload()));
		});

	// JS specific watches to also detect removing/adding of files
	// Note: Will also run the HTML task again (when needed) to update the linked files
	watch({ glob: config.app + '/js/**/ie/*.js', emitOnGlob: false, name: 'JS-IE', emit: 'all' }, function() {
		gulp.start('scripts-ie');
	}).pipe(plumber())
		.pipe(gulpif(lrStarted && config.useLR, connect.reload()));

	watch({ glob: [config.app + '/**/view-*.js'], emitOnGlob: false, name: 'JS-VIEW', emit: 'all' }, function() {
		sequence('scripts-view', 'html');
	}).pipe(plumber());

	watch({ glob: [config.app + '/js/**/*.js', '!**/ie/*.js', '!**/view-*.js'], emitOnGlob: false, name: 'JS', emit: 'all' }, function() {
		sequence('scripts-main', 'html');
	}).pipe(plumber());

	// Watch images and call their task
	gulp.watch(config.app + '/images/**/*'
		,	['connect-livereload', 'tinylr']
		,	function(event){ gulp.start('images');
	});

	// Watch html and call its task
	gulp.watch(config.app + '/html/*.html'
		,	['connect-livereload', 'tinylr']
		,	function(event){ gulp.start('html');
	});
});

// Zipping --------------------------------------------------------------------
//
// Zips up the production folder is wanted (via prompt)

gulp.task('zip', function(cb)
{
	cb(null);

	ask({
			type: 'confirm'
		,	message: 'Would to like to have this zipped up?'
		,	name: 'zip'
		,	default: false

	}, function(answer)
	{
		if(answer.zip)
		{
			gulp.src([config.dist + '/**/*', config.dist + '/.htaccess'])
				.pipe(zip('Archive.zip'))
				.pipe(gulp.dest(config.dist));

			gulputil.log('Made Archive.zip at ./' + config.dist);
		}
	});
});

// The default task -----------------------------------------------------------
//
// Runs when you call 'gulp' from the CLI

gulp.task('default', function()
{
	sequence('clean', ['sass', 'scripts-view', 'scripts-main', 'scripts-ie', 'fonts', 'images', 'misc'], 'html', function()
	{
		if(!isProduction) gulp.start('server');
		else gulp.start('zip');
	});
});


}());
