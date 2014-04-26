'use strict';

var
	path = require('path'),
	fs = require('fs'),
	ncp = require('ncp').ncp,
	chalk = require('chalk'),
	_ = require('lodash'),
	prompt = require('inquirer').prompt,
	sequence = require('run-sequence'),
	stylish = require('jshint-stylish'),

	gulp = require('gulp'),
	debug = require('gulp-debug'),
	rimraf = require('gulp-rimraf'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect'),
	exclude = require('gulp-ignore').exclude,
	include = require('gulp-ignore').include,
	//	sass = require('gulp-sass')
	sass = require('gulp-ruby-sass'),
	sassgraph = require('gulp-sass-graph'),
	autoprefixer = require('gulp-autoprefixer'),
	htmlhint = require('gulp-htmlhint'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	replace = require('gulp-replace'),
	uglify = require('gulp-uglify'),
	newer = require('gulp-newer'),
	imagemin = require('gulp-imagemin'),
	header = require('gulp-header'),
	footer = require('gulp-footer'),
	tap	= require('gulp-tap'),
	inject = require('gulp-inject'),

	flags = require('minimist')(process.argv.slice(2)),
	boilerplatePath = __dirname + '/boilerplate',
	cwd = process.cwd(),
	lrStarted = false,
	lrDisable = flags.nolr || false,
	isProduction = flags.production || flags.prod || false,
	config;
;

// Error handler
//
// Errors from sass or autoprefix can crash the CLI process
// By catching and processing them this can be fixed.
//
// Known bug in Gulp (and upcoming feature in v4)

function handleError (err) {

	console.log(err.toString());
	this.emit('end');
}

// INIT -----------------------------------------------------------------------
//

gulp.task('init', function (cb) {

	// Check if working directory is empty
	// Exclude . files (such as .DS_Store on OS X)
	var cwdFiles = _.remove(fs.readdirSync(cwd), function (file) {
		return file.substring(0,1) !== '.';
	});

	if (cwdFiles.length > 0) {

		// Make sure the user knows what is about to happen
		console.log(chalk.yellow('The current directory is not empty!'))
		prompt({
			type: 'confirm',
			message: 'Initializing will empty the current directory. Continue?',
			name: 'override',
			default: false
		}, function (answer) {

			if (answer.override) {
				// Make really really sure that the user wants this
				prompt({
					type: 'confirm',
					message: 'Removed files are gone forever. Continue?',
					name: 'overridconfirm',
					default: false
				}, function (answer) {
					if (answer.overridconfirm) moveBoilerplateFiles();
					else process.exit(0);
				});
			}
			else process.exit(0);
		});
	}
	else moveBoilerplateFiles();

	cb(null);
});

function moveBoilerplateFiles () {

	// Clean up directory
	console.log(chalk.green('Emptying current directory'))
	rimraf.sync(cwd);

	// Move files from the global boilerplate folder
	// into the current working directory
	console.log(chalk.grey('Moving boilerplate files to'), chalk.magenta(cwd));

	ncp(boilerplatePath, cwd, function (err) {

		if (err) {
			console.log(chalk.red('Something went wrong'), err);
			process.exit(0);
		}

		// Ask the user if he wants to continue and
		// have the files served
		console.log(chalk.green('All done!'));
		prompt({
				type: 'confirm',
				message: 'Would you like to have these files served?',
				name: 'serve',
				default: true

		}, function (answer) {

			if (answer.serve) gulp.start('serve');
			else process.exit(0);
		});
	});
}

// BUILD ----------------------------------------------------------------------
//

gulp.task('build', function (cb) {

	// Load the config.json file
	console.log(chalk.green('Loading config.json...'));
	fs.readFile('config.json', 'utf8', function (err, data) {

		if (err) {
			console.log(chalk.red('Something went wrong. Most likely Headstart hasn\'t been initiated yet. Aborting.'), err);
			process.exit(0);
		}

		// Try parsing the config data as JSON
		try {
			config = JSON.parse(data);
		} catch (err) {
			console.log(chalk.red('The config.json file is not valid json. Aborting.'), err);
			process.exit(0);
		}

		// Run build tasks
		// Serve files if Headstart was run with the --serve flag
		console.log(chalk.green('Building...'));
		if (flags.serve) {
			sequence('clean', ['sass', 'scripts-view', 'scripts-main', 'fonts', 'images', 'misc', 'other'], 'html', 'server', cb);
		} else {
			sequence('clean', ['sass', 'scripts-view', 'scripts-main', 'fonts', 'images', 'misc', 'other'], 'html', cb);
		}	
	});
});

// CLEAN ----------------------------------------------------------------------
//

gulp.task('clean', function (cb) {

	// Remove export folder and files
	return gulp.src(config.export, {read: false})
		.pipe(rimraf())
	;
});

// SASS -----------------------------------------------------------------------
//

// Note: Once libsass fixed the @extend bug, Headstart will switch
// to that implementation rather than the Ruby one (which is slower).
// https://github.com/hcatlin/libsass/issues/146

gulp.task('sass', function (cb) {

	// Process the .scss files
	// While serving, this task opens a continuous watch
	return ( !lrStarted ?
			gulp.src('./assets/sass/*.scss')
			:
			watch({ glob: './assets/sass/**/*.scss', emitOnGlob: false, name: 'SCSS' })
		)
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(gulpif(lrStarted, sassgraph(['./assets/sass'])))
		//.pipe(sass({ outputStyle: (isProduction ? 'compressed' : 'nested'), errLogToConsole: true }))
		.pipe(sass({ style: (isProduction ? 'compressed' : 'nested') }))
		.pipe(gulpif(config.autoPrefix, autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')))
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulp.dest(config.export + '/assets/css'))
		.pipe(gulpif(lrStarted, connect.reload()))
	;

	// Continuous watch never ends, so end it manually
	if(lrStarted) cb(null);
});

// SCRIPTS --------------------------------------------------------------------
//

// JSHint options:	http://www.jshint.com/docs/options/
gulp.task('hint-scripts', function (cb) {

	if (!config.hint) cb(null);
	else {
		// Hint all non-lib js files and exclude _ prefixed files
		return gulp.src([
				'./assets/js/*.js',
				'./assets/js/core/*.js',
				'!_*.js'
			])
			.pipe(jshint('./.jshintrc'))
			.pipe(jshint.reporter(stylish))
		;
	}
});

gulp.task('scripts-main', ['hint-scripts'], function () {

	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src([
				'./assets/js/libs/jquery*.js',
				'./assets/js/libs/ender.js',

				(isProduction ? '!' : '') + './assets/js/libs/dev/*.js',

				'./assets/js/libs/patches/matchmedia.polyfill.js',
				'./assets/js/libs/patches/matchmedia.addListener.js',
				'./assets/js/libs/patches/respond.js',
				'./assets/js/libs/patches/*.js',

				'./assets/js/libs/*.js',
				'./assets/js/core/*.js',
				'./assets/js/*.js',
				'!' + './assets/js/view-*.js',
				'!_*.js'
			], {base: './' + './assets/js'}
		)
		.pipe(gulpif(isProduction, concat('core-libs.min.js')))
		.pipe(gulpif(isProduction, replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest(config.export + '/assets/js'))
	;
});

gulp.task('scripts-view', ['hint-scripts'], function (cb) {

	return gulp.src('./assets/js/view-*.js')
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulpif(isProduction, replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest(config.export + '/assets/js'))
	;
});

// IMAGES ---------------------------------------------------------------------
//

gulp.task('images', function (cb) {

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	gulp.src([
			'./assets/images/**/*.jpg',
			'./assets/images/**/*.jpeg',
			'./assets/images/**/*.png',
			'./assets/images/**/*.gif',
			'./assets/images/**/*.svg'
		])
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(newer(config.export + '/images'))
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest(config.export + '/assets/images'))
		.pipe(gulpif(lrStarted, connect.reload()))
	;

	// Make a copy of the favicon.png, and make a .ico version for IE
	// Move to root of export folder
	gulpif(isProduction, gulp.src('./assets/images/icons/favicon.png')
		.pipe(rename({extname: '.ico'}))
		.pipe(gulp.dest(config.export))
	);

	cb(null);
});

// OTHER ----------------------------------------------------------------------
//

gulp.task('other', function (cb) {

	// Make sure other files and folders are copied over
	// eg. fonts, videos, ...
	return gulp.src([
			'./assets/**/*',
			'!./assets/sass',
			'!./assets/js',
			'!./assets/images'
		])
		.pipe(gulp.dest(config.export))
	;
});

// MISC -----------------------------------------------------------------------
//
 
gulp.task('misc', function (cb) {

	// Make a functional version of the htaccess.txt
	gulp.src('./misc/htaccess.txt')
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest(config.export));

	// In --production mode, copy over all the other stuff
	if (isProduction) {
		gulp.src(['./misc/*', '!**/htaccess.txt'])
			.pipe(gulp.dest(config.dist));
	}

    cb(null);
});

// HTML -----------------------------------------------------------------------
//

// HTMLHint option:	https://github.com/yaniswang/HTMLHint/wiki/Rules

gulp.task('hint-html', function (cb) {

	if (!config.hint) cb(null);
	else {
		return gulp.src('./templates/*.html')
			.pipe(htmlhint('./.htmlhintrc'))
			.pipe(htmlhint.reporter(stylish))
		;
	}
});
 
gulp.task('templates', ['hint-html'], function (cb) {

	// Inject links to correct assets in all the .html files
	// Add livereload tag in development
	// Minify in production
	//
	// Note:
	// HTML comments are being left in for the purpose of having conditional statements.
	// Perhaps this could be made optional through the config setting.

	gulp.src('./templates/*.html')
		.pipe(tap(function(htmlFile)
		{
			// Production will get 1 file only
			// Development gets raw base files
			var 
				injectItems = isProduction ?
					[config.export + '/assets/js/core-libs.min.js']
					:
					[
						'./assets/js/libs/jquery*.js',
						'./assets/js/libs/ender.js',

						(isProduction ? '!' : '') + './assets/js/libs/dev/*.js',

						'./assets/js/libs/patches/matchmedia.polyfill.js',
						'./assets/js/libs/patches/matchmedia.addListener.js',
						'./assets/js/libs/patches/respond.js',
						'./assets/js/libs/patches/*.js',

						'./assets/js/libs/*.js',
						'./assets/js/core/*.js',
						'./assets/js/*.js',

						'!' + './assets/js/view-*.js',
						'!_*.js'
					],
				baseName = path.basename(htmlFile.path),
				viewName = baseName.split('.')[0]
			;

			// Add specific js and css files to inject queue
			injectItems.push(config.export + '/assets/js/view-' + viewName+ (isProduction ? '.min' : '') + '.js');
			injectItems.push(config.export + '/assets/css/common' + (isProduction ? '.min' : '') + '.css')
			injectItems.push(config.export + '/assets/css/' + viewSpecificName + '.css');

			// Combine with header and footer and
			// inject files into the HTML file
			gulp.src('./templates/' + baseName)
				.pipe(header.fromFile('./templates/common/header.html'))
				.pipe(footer.fromFile('./templates/common/footer.html'))
				.pipe(inject(gulp.src(injectItems, {read: false}), {
						ignorePath: ['/dev', '/app', '/dist']
					,	addRootSlash: false
				}))
				.pipe(rename({basename: viewName}))
				.pipe(gulp.dest(config.export))
				.pipe(gulpif(lrStarted, connect.reload()));
		}));

	cb(null);
});

// SERVER ---------------------------------------------------------------------
//

gulp.task('server', function (cb) {

	console.log(chalk.green('Serving files...'));

	// Start the livereload server and connect to it
	sequence('connect-livereload', function () {
		// Store started state globally
		lrStarted = true;
		// Sass watch is integrated into task with a switch
		// based on the flag above
		gulp.start('sass');
	});

	// JS specific watches to also detect removing/adding of files
	// Note: Will also run the HTML task again to update the linked files
	watch({ glob: ['./**/view-*.js'], emitOnGlob: false, name: 'JS-VIEW', emit: 'all' }, function() {
		sequence('scripts-view', 'templates');
	}).pipe(plumber({ errorHandler: handleError }));

	watch({ glob: ['./assets/js/**/*.js', '!**/view-*.js'], emitOnGlob: false, name: 'JS-MAIN', emit: 'all' }, function() {
		sequence('scripts-main', 'templates');
	}).pipe(plumber({ errorHandler: handleError }));

	// Watch images and call their task
	gulp.watch('./assets/images/**/*', ['images']);

	// Watch templates and call its task
	gulp.watch('./templates/**/*', ['templates']);

	cb();
});

gulp.task('connect-livereload', connect.server({
	root: [config.export],
	port: config.port,
	livereload: flags.nolr ? false : true,
	open: flags.open ? {
			file: config.defaultPage,
			browser: config.browser
		} : null
}));

// DEFAULT --------------------------------------------------------------------
//

gulp.task('default', function () {
	gulp.start('build');
});