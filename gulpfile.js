'use strict';

var
	path 				= require('path'),
	http				= require ('http'),
	fs 					= require('fs'),
	ncp 				= require('ncp').ncp,
	chalk 				= require('chalk'),
	_ 					= require('lodash'),
	prompt 				= require('inquirer').prompt,
	sequence 			= require('run-sequence'),
	stylish 			= require('jshint-stylish'),
	open 				= require('open'),
	copy_paste 			= require('copy-paste').silent(),
	ghdownload			= require('github-download'),

	gulp 				= require('gulp'),
	rimraf 				= require('gulp-rimraf'),
	watch 				= require('gulp-watch'),
	plumber 			= require('gulp-plumber'),
	gulpif 				= require('gulp-if'),
	rename 				= require('gulp-rename'),
	connect 			= require('gulp-connect'),
	//	sass 			= require('gulp-sass'),
	sass 				= require('gulp-ruby-sass'),
	sassgraph 			= require('gulp-sass-graph'),
	autoprefixer 		= require('gulp-autoprefixer'),
	jshint 				= require('gulp-jshint'),
	deporder 			= require('gulp-deporder'),
	concat 				= require('gulp-concat'),
	replace 			= require('gulp-replace'),
	uglify 				= require('gulp-uglify'),
	newer 				= require('gulp-newer'),
	imagemin 			= require('gulp-imagemin'),
	tap					= require('gulp-tap'),
	inject 				= require('gulp-inject'),
	handlebars			= require('gulp-compile-handlebars'),
	htmlmin				= require('gulp-htmlmin'),

	flags 				= require('minimist')(process.argv.slice(2)),
	gitConfig			= {user: 'flovan', repo: 'headstart-boilerplate'}, // , ref: 'wip'
	cwd 				= process.cwd(),
	tmpFolder			= '.tmp',
	lrStarted 			= false,
	lrDisable 			= flags.nolr || false,
	isProduction 		= flags.production || flags.prod || false,
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
		console.log(chalk.yellow('The current directory is not empty!'));
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

					if (answer.overridconfirm) {
						// Clean up directory
						console.log(chalk.grey('Emptying current directory'));
						sequence('clean-tmp', 'clean-cwd', downloadBoilerplateFiles);
					}
					else process.exit(0);
				});
			}
			else process.exit(0);
		});
	}
	else downloadBoilerplateFiles();

	cb(null);
});

function downloadBoilerplateFiles () {

	// Download the boilerplate files with a progress bar
	console.log(chalk.grey('Downloading boilerplate files...'));

	ghdownload(gitConfig, tmpFolder)
		.on('error', function (error) {
			console.log(chalk.red('An error occurred. Aborting.', error));
			process.exit(0);
		})
		.on('end', function () {
			console.log(chalk.green('✔ Download complete!'));
			console.log(chalk.grey('Cleaning up...'));

			ncp(tmpFolder, cwd, function (err) {

				if (err) {
					console.log(chalk.red('Something went wrong. Please try again'), err);
					process.exit(0);
				}

				sequence('clean-tmp', function () {
					finishInit();
				});
			});
		})
	;
}

function finishInit () {

	// Ask the user if he wants to continue and
	// have the files served
	prompt({
			type: 'confirm',
			message: 'Would you like to have these files served?',
			name: 'build',
			default: true
	}, function (buildAnswer) {

		if (buildAnswer.build) {
			flags.serve = true;
			prompt({
					type: 'confirm',
					message: 'Should they be opened in the browser?',
					name: 'open',
					default: true

			}, function (openAnswer) {

				if (openAnswer.open) flags.open = true;
				prompt({
					type: 'confirm',
					message: 'Should they be opened in an editor?',
					name: 'edit',
					default: true

				}, function (editAnswer) {

					if (editAnswer.edit) flags.edit = true;
					gulp.start('build');
				});
			});
		}
		else process.exit(0);
	});
}

// BUILD ----------------------------------------------------------------------
//

gulp.task('build', function (cb) {

	// Load the config.json file
	console.log(chalk.grey('Loading config.json...'));
	fs.readFile('config.json', 'utf8', function (err, data) {

		if (err) {
			console.log(chalk.red('Cannot find config.json. Have you initiated Headstart?'), err);
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
		console.log(chalk.grey('Building ' + (flags.production ? ' production' : 'dev') + ' version...'));
		if (flags.serve) {
			sequence(
				'clean-export',
				[
					'sass',
					'scripts-view',
					'scripts-main',
					'scripts-ie',
					'images',
					'misc',
					'other'
				],
				'templates',
				'server',
				cb
			);
		} else {
			sequence(
				'clean-export',
				[
					'sass',
					'scripts-view',
					'scripts-main',
					'scripts-ie',
					'images',
					'misc',
					'other'
				],
				'templates',
				function () {
					if(flags.edit) openEditor();
					console.log(chalk.green('✔ All done!'));
				}
			);
		}
	});

	cb(null);
});

// CLEAN ----------------------------------------------------------------------
//

gulp.task('clean-export', function (cb) {

	// Remove export folder and files
	return gulp.src([
			config.export_templates,
			config.export_assets + '/assets'
		], {read: false})
		.pipe(rimraf({force: true}))
	;
});

gulp.task('clean-cwd', function (cb) {

	// Remove cwd files
	return gulp.src(cwd + '/**/*', {read: false})
		.pipe(rimraf({force: true}))
	;
});

gulp.task('clean-tmp', function (cb) {

	// Remove temp folder
	return gulp.src(tmpFolder, {read: false})
		.pipe(rimraf({force: true}))
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
			gulp.src('assets/sass/*.scss')
			:
			watch({ glob: 'assets/sass/**/*.scss', emitOnGlob: false, name: 'SCSS', silent: true })
				.pipe(plumber({ errorHandler: handleError }))
				.pipe(sassgraph(['assets/sass']))
		)
		//.pipe(sass({ outputStyle: (isProduction ? 'compressed' : 'nested'), errLogToConsole: true }))
		.pipe(sass({ style: (isProduction ? 'compressed' : 'nested') }))
		.pipe(gulpif(config.autoPrefix, autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')))
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulp.dest(config.export_assets + '/assets/css'))
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
				'assets/js/*.js',
				'assets/js/core/*.js',
				'!_*.js'
			])
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter(stylish))
		;
	}
});

gulp.task('scripts-main', ['hint-scripts'], function () {

	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src([
				'assets/js/libs/jquery*.js',
				'assets/js/libs/ender.js',

				(isProduction ? '!' : '') + 'assets/js/libs/dev/*.js',

				'assets/js/libs/*.js',
				'assets/js/core/*.js',
				'assets/js/*.js',
				'!' + 'assets/js/view-*.js',
				'!**/_*.js'
			], {base: '' + 'assets/js'}
		)
		.pipe(gulpif(isProduction, concat('core-libs.min.js')))
		.pipe(gulpif(isProduction, replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest(config.export_assets + '/assets/js'))
	;
});

gulp.task('scripts-view', ['hint-scripts'], function (cb) {

	return gulp.src('assets/js/view-*.js')
		.pipe(gulpif(isProduction, rename({suffix: '.min'})))
		.pipe(gulpif(isProduction, replace(/(\/\/)?(console\.)?log\((.*?)\);?/g, '')))
		.pipe(gulpif(isProduction, uglify()))
		.pipe(gulp.dest(config.export_assets + '/assets/js'))
	;
});

gulp.task('scripts-ie', function (cb) {

	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src('assets/js/libs/patches/**/*.js')
		.pipe(deporder())
		.pipe(concat('ie.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(config.export_assets + '/assets/js'));
})

// IMAGES ---------------------------------------------------------------------
//

gulp.task('images', function (cb) {

	// Make a copy of the favicon.png, and make a .ico version for IE
	// Move to root of export folder
	gulp.src('assets/images/icons/favicon.png')
		.pipe(rename({extname: '.ico'}))
		.pipe(gulp.dest(config.export_misc))
	;

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	return gulp.src([
			'assets/images/**/*.jpg',
			'assets/images/**/*.jpeg',
			'assets/images/**/*.png',
			'assets/images/**/*.gif',
			'assets/images/**/*.svg'
		])
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(newer(config.export_assets+ '/assets/images'))
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true, silent: true }))
		.pipe(gulp.dest(config.export_assets + '/assets/images'))
		.pipe(gulpif(lrStarted, connect.reload()))
	;
});

// OTHER ----------------------------------------------------------------------
//

gulp.task('other', function (cb) {

	// Make sure other files and folders are copied over
	// eg. fonts, videos, ...
	return gulp.src([
			'assets/**/*',
			'!assets/sass',
			'!assets/sass/**/*',
			'!assets/js/**/*',
			'!assets/images/**/*'
		])
		.pipe(gulp.dest(config.export_assets + '/assets'))
	;
});

// MISC -----------------------------------------------------------------------
//
 
gulp.task('misc', function (cb) {

	// In --production mode, copy over all the other stuff
	if (isProduction) {
		// Make a functional version of the htaccess.txt
		gulp.src('misc/htaccess.txt')
			.pipe(rename('.htaccess'))
			.pipe(gulp.dest(config.export_misc))
		;

		gulp.src(['misc/*', '!misc/htaccess.txt'])
			.pipe(gulp.dest(config.export_misc))
		;
	}

	cb(null);
});

// HTML -----------------------------------------------------------------------
//
 
gulp.task('templates', function (cb) {

	if(flags.onlyassets) {
		cb(null);
		return;
	}

	// Inject links to correct assets in all the .* template files
	// Add livereload tag when not in --production
	gulp.src('templates/*.*')
		.pipe(tap(function(htmlFile)
		{
			var
				// Select JS files
				// Production will get 1 file only
				// Development gets raw base files 
				injectItems = isProduction ?
					[config.export_assets + '/assets/js/core-libs.min.js']
					:
					[
						'assets/js/libs/jquery*.js',
						'assets/js/libs/ender.js',

						(isProduction ? '!' : '') + 'assets/js/libs/dev/*.js',

						'assets/js/libs/*.js',
						'assets/js/core/*.js',
						'assets/js/*.js',

						'!' + 'assets/js/view-*.js',
						'!**/_*.js'
					],
				// Extract bits from filename
				baseName = path.basename(htmlFile.path),
				nameParts = baseName.split('.'),
				ext = _.without(nameParts, _.first(nameParts)).join('.'),
				viewBaseName = _.last(nameParts[0].split('view-')),
				viewName = 'view-' + viewBaseName + (isProduction ? '.min' : ''),
				// Make sure Windows paths work down below
				cwdParts = cwd.replace(/\\/g, '/').split('/')
			;

			// Add specific js and css files to inject queue
			injectItems.push(config.export_assets + '/assets/js/' + viewName + '.js');
			injectItems.push(config.export_assets + '/assets/css/main' + (isProduction ? '.min' : '') + '.css')
			injectItems.push(config.export_assets + '/assets/css/' + viewName + '.css');

			// If assembly is on (default), combine with header and footer
			// and inject asset file references
			// gulp.src([
			// 		config.assemble_templates ? 'templates/**/header.*' : '',
			// 		'templates/' + baseName,
			// 		config.assemble_templates ? 'templates/**/footer.*' : ''
			// 	])
			// 	.pipe(concat(baseName))
			// 	.pipe(inject(gulp.src(injectItems, {read: false}), {
			// 		ignorePath: [
			// 			_.without(cwdParts, cwdParts.splice(-1)[0]).join('/')
			// 		].concat(config.export_assets.split('/')),
			// 		addRootSlash: false,
			// 		addPrefix: config.template_asset_prefix
			// 	}))
			// 	//.pipe(rename({basename: viewBaseName}))
			// 	.pipe(gulpif(config.minifyHTML, htmlmin({
			// 		removeComments: true,
			// 		collapseWhitespace: true,
			// 		removeAttributeQuotes: true,
			// 		removeRedundantAttributes: true,
			// 		removeEmptyAttributes: true,
			// 		collapseBooleanAttributes: true
			// 	})))
			// 	.pipe(gulp.dest(config.export_templates))
			// 	.pipe(gulpif(lrStarted, connect.reload()))
			// ;
			gulp.src('templates/' + baseName)
				.pipe(gulpif(config.assemble_templates, handlebars({}, {
					batch: ['templates/layout', 'templates/partials']
				})))
				.pipe(inject(gulp.src(injectItems, {read: false}), {
					ignorePath: [
						_.without(cwdParts, cwdParts.splice(-1)[0]).join('/')
					].concat(config.export_assets.split('/')),
					addRootSlash: false,
					addPrefix: config.template_asset_prefix
				}))
				.pipe(gulpif(config.minifyHTML, htmlmin({
					removeComments: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					removeEmptyAttributes: true,
					collapseBooleanAttributes: true
				})))
				.pipe(gulp.dest(config.export_templates))
				.pipe(gulpif(lrStarted, connect.reload()))
			;
		}))
	;

	// If assebly is off, export all other folders and files
	if (!config.assemble_templates) {
		gulp.src(['templates/**/*', '!templates/*.*'])
			.pipe(gulp.dest(config.export_templates));
	}

	cb(null);
});

// SERVER ---------------------------------------------------------------------
//

// Open served files in browser
function openBrowser () {

	console.log(
		chalk.grey('Opening'),
		chalk.magenta('http://' + config.host + ':' + config.port),
		chalk.grey('in'),
		chalk.magenta(config.browser)
	);
	open('http://' + config.host + ':' + config.port, config.browser);
}

// Open files in editor
function openEditor () {

	console.log(
		chalk.grey('Opening'),
		chalk.magenta(cwd),
		chalk.grey('in'),
		chalk.magenta(config.editor)
	);
	open(cwd, config.editor);
}

gulp.task('server', function (cb) {

	console.log(chalk.grey('Starting server...'));

	// Start the livereload server and connect to it
	sequence('connect-livereload', function () {

		// Store started state globally
		lrStarted = true;

		// Sass watch is integrated into task with a switch
		// based on the flag above
		gulp.start('sass');

		console.log(chalk.cyan('Serving files at'), chalk.magenta('http://' + config.host + ':' + config.port));
		if(flags.open) openBrowser();
		if(flags.edit) openEditor();

		console.log(chalk.cyan('Copied url to clipboard!'));
		copy('http://' + config.host + ':' + config.port);
		
		console.log(chalk.green('Ready ... set ... go!'))
	});

	// JS specific watches to also detect removing/adding of files
	// Note: Will also run the HTML task again to update the linked files
	watch({ glob: ['**/view-*.js'], emitOnGlob: false, name: 'JS-VIEW', silent: true }, function() {
		sequence('scripts-view', 'templates');
	}).pipe(plumber({ errorHandler: handleError }));

	watch({ glob: ['assets/js/**/*.js', '!**/view-*.js'], emitOnGlob: false, name: 'JS-MAIN', silent: true }, function() {
		sequence('scripts-main', 'scripts-ie', 'templates');
	}).pipe(plumber({ errorHandler: handleError }));

	// Watch images and call their task
	gulp.watch('assets/images/**/*', function () {
		gulp.start('images');
	});

	// Watch templates and call its task
	watch({ glob: ['templates/**/*'], emitOnGlob: false, name: 'TEMPLATE', silent: true }, function() {
		sequence('templates');
	}).pipe(plumber({ errorHandler: handleError }));
});

gulp.task('connect-livereload', function (cb) {
	connect.server({
		root: [config.export_templates],
		host: config.host,
		port: config.port,
		livereload: flags.nolr ? false : true,
		silent: true
	});

	cb(null);
});

// DEFAULT --------------------------------------------------------------------
//

gulp.task('default', function () {
	gulp.start('build');
});