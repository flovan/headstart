(function(){

/*
#
#	▒█░▒█ █▀▀ █▀▀█ ▒█▀▀▄ █▀▀ ▀▀█▀▀ █▀▀█ █▀▀█ ▀▀█▀▀ 
#	▒█▀▀█ █▀▀ █▄▄█ ▒█░▒█ ▀▀█ ░▒█░░ █▄▄█ █▄▄▀ ░▒█░░ 
#	▒█░▒█ ▀▀▀ ▀░░▀ ▒█▄▄▀ ▀▀▀ ░▒█░░ ▀░░▀ ▀░▀▀ ░▒█░░ 
#
#	A easy-to-use Gulp framework/boilerplate/template/whatever.
#	➳  https://github.com/flovan/Headstart
#
*/

'use strict';

// Load in all the plugins ----------------------------------------------------
//

var		path			= require('path')
	,	connect			= require('connect')
	,	http			= require('http')
	,	open			= require('open')
	,	lr				= require('tiny-lr')()
	,	ask				= require('inquirer').prompt

	,	gulp			= require('gulp')
	,	gulputil		= require('gulp-util')
	,	gulpif			= require('gulp-if')
	,	tap				= require('gulp-tap')
	,	inject			= require('gulp-inject')
	,	rimraf			= require('gulp-rimraf')
	,	newer			= require('gulp-newer')
	,	watch			= require('gulp-watch')
	,	htmlmin			= require('gulp-minify-html')
	,	htmlhint		= require('gulp-htmlhint')
	,	jshint			= require('gulp-jshint')
	,	stylish			= require('jshint-stylish')
	,	concat			= require('gulp-concat')
	,	replace			= require('gulp-replace')
	,	uglify			= require('gulp-uglify')
	,	sass			= require('gulp-ruby-sass')
	,	sassGraph		= require('gulp-sass-graph')
	,	autoprefixer	= require('gulp-autoprefixer')
	,	cache			= require('gulp-cache')
	,	imagemin		= require('gulp-imagemin')
	,	svgmin			= require('gulp-svgmin')
	,	rename			= require('gulp-rename')
	,	refresh			= require('gulp-livereload')
	,	embedlr			= require('gulp-embedlr')
	,	zip				= require('gulp-zip')

	,	lrStarted		= false
	,	config			= {

		// Personal settings --------------------------------------------------
		//
		// Adjust these to your needs

			// Your favorite browser
			// OS X: google chrome, Linux: google-chrome, Windows: chrome
			browser:		'google chrome'

			// The default page to open in the browser
		,	defaultPage:	'index.html'

			// Will open all the HTML files in the browser; overrides defaultPage
		,	openAllFiles:	false

			// Will enable auto-prefixing when true
		,	autoPrefix:		false

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
		.pipe(sass({ compass: true, style: isProduction ? 'compressed' : 'nested' }))
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

gulp.task('hint-html', function()
{
	return gulp.src(config.app + '/html/*.html')
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter(stylish));
});

gulp.task('hint-main', function()
{
	return gulp.src([
				config.app + '/js/app.js'
			,	config.app + '/js/core/*.js'
			,	'!' + config.app + '/js/**/log.js'
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
//
// JSHint options:	http://www.jshint.com/docs/options/
// HTMLHint option:	https://github.com/yaniswang/HTMLHint/wiki/Rules

gulp.task('scripts-main', ['hint-main', 'scripts-view'], function()
{
	return gulp.src([
				config.app + '/js/libs/jquery*.js'
			,	config.app + '/js/libs/*.js'
			,	'!' + config.app + '/js.libs.'
			,	config.app + '/js/core/*.js'
			,	(isProduction ? '!**/log.js' : '')
			,	config.app + '/js/app.js'
		], {base: './' + config.app + '/js'})
		.pipe(gulpif(isProduction, concat('core-libs.min.js')))
		.pipe(gulpif(isProduction, replace(/(console\.)?log(.*?);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest(runDir + '/js'));
});

gulp.task('scripts-view', ['hint-view', 'scripts-ie'], function()
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
		.pipe(gulp.dest(runDir + '/images'));

	gulp.src(config.app + '/images/**/*.svg')
		.pipe(newer(runDir + '/images'))
		.pipe(gulpif(isProduction, svgmin()))
		.pipe(gulp.dest(runDir + '/images'));

	cb(null);
});

// Fonts ----------------------------------------------------------------------
//
// Copies the font files over

gulp.task('fonts', function()
{
	return gulp.src(config.app + '/fonts/*')
		.pipe(newer(runDir + '/fonts'))
		.pipe(gulp.dest(runDir + '/fonts'));
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
// Perhaps this should be made optional through the config setting.
 
gulp.task('html', function(cb)
{
	gulp.src(config.app + '/html/*.html')
		.pipe(tap(function(htmlFile)
		{
			// Production will get 1 file only
			// Developmment gets raw base files
			var injectItems = isProduction ? [config.dist + '/js/core-libs.min.js'] : [
						config.app + '/js/libs/jquery*.js'
					,	config.app + '/js/libs/*.js'
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
				.pipe(gulpif(!isProduction, embedlr()))
				.pipe(gulpif(isProduction, htmlmin({ comments: true })))
				.pipe(gulp.dest(runDir));
		}));

	cb(null);
});

// Livereloading --------------------------------------------------------------
//
// Sets up a livereload server, and opens files in the browser

gulp.task('connect-livereload', function()
{
	var		middleware = [
					require('connect-livereload')({ port: config.lr })
				,	connect.static(config.dev)
				,	connect.directory(config.dev)
			]
		,	app = connect.apply(null, middleware)
		,	server = http.createServer(app);

	server
		.listen(config.port)
		.on('listening', function()
		{
			gulputil.log('Started connect web server on http://localhost:' + config.port + '.');
			lrStarted = true;

			// Open the default .html file in the browser
			if(!config.openAllFiles) open('http://localhost:' + config.port + '/' + config.defaultPage, config.browser);
			// or open all the files
			else
			{
				gulp.src(config.app + '/html/*.html')
					.pipe(tap(function(htmlFile)
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
			return gulputil.log(err);
		}
	});
});

gulp.task('server', ['sass', 'scripts-main', 'scripts-view', 'scripts-ie', 'images', 'html'], function()
{
	// Startup the livereload server and connect to it
	gulp.start('connect-livereload', 'tinylr');

	// SCSS specific compilation is repeated here so the process can work with single files (= faster)
	// rather then with all matches scss files
	watch({ glob: config.app + '/sass/**/*.scss', emitOnGlob: false })
		.pipe(sass({ compass: true, style: isProduction ? 'compressed' : 'nested' }))
		.pipe(gulpif(config.autoPrefix, autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')))
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulp.dest(runDir + '/css'));

	// Watch js and call appropriate task
	gulp.watch(config.app + '/js/**/*.js'
		,	['connect-livereload', 'tinylr']
		,	function(event){ gulp.start('scripts-main', 'scripts-view', 'scripts-ie');
	});

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

	// Reload on changed output files
	gulp.watch([
			config.dev + '/*.html'
		,	config.dev + '/js/*.js'
		,	config.dev + '/css/*.css'
		,	config.dev + '/images/*.{jpg|gif|png|svg}'
		,	config.dev + '/fonts/*'
	], ['connect-livereload', 'tinylr'], function(event)
	{
		gulputil.log('File ' + event.path + ' was ' + event.type);
		refresh(lr).changed(event.path);
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

gulp.task('default', ['clean'], function()
{
	gulp.start('sass', 'scripts-view', 'scripts-main', 'scripts-ie', 'fonts', 'images', 'misc', 'html');
	if(!isProduction) gulp.start('server');
	else gulp.start('zip');
});


}());
