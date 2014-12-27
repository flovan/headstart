/*global require, process, __dirname*/

'use strict';

// REQUIRES -------------------------------------------------------------------

var
	path                = require('path'),
	globule             = require('globule'),
	http                = require ('http'),
	fs                  = require('fs'),
	ncp                 = require('ncp').ncp,
	chalk               = require('chalk'),
	_                   = require('lodash'),
	prompt              = require('inquirer').prompt,
	sequence            = require('run-sequence'),
	ProgressBar         = require('progress'),
	stylish             = require('jshint-stylish'),
	open                = require('open'),
	ghdownload          = require('github-download'),
	browserSync         = require('browser-sync'),
	psi                 = require('psi'),
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	}),
	flags               = require('minimist')(process.argv.slice(2))
;

// VARS -----------------------------------------------------------------------

var
	gitConfig           = {
		user: 'flovan',
		repo: 'headstart-boilerplate',
		ref:  '1.2.1'
	},
	cwd                 = process.cwd(),
	tmpFolder           = '.tmp',
	assetsFolder        = 'assets',
	stdoutBuffer        = [],
	lrStarted           = false,
	htmlminOptions      = {
		removeComments:                true,
		collapseWhitespace:            true,
		collapseBooleanAttributes:     true,
		removeAttributeQuotes:         true,
		useShortDoctype:               true,
		removeScriptTypeAttributes:    true,
		removeStyleLinkTypeAttributes: true,
		minifyJS:                      true,
		minifyCSS:                     true
	},
	isProduction        = ( flags.production || flags.p ) || false,
	isServe             = ( flags.serve || flags.s ) || false,
	isOpen              = ( flags.open || flags.o ) || false,
	isEdit              = ( flags.edit || flags.e ) || false,
	isVerbose           = flags.verbose || false,
	isTunnel            = ( flags.tunnel || flags.t ) || false,
	tunnelUrl           = null,
	isPSI               = flags.psi || false,
	config              = null,
	bar                 = null
;

// LOGGING --------------------------------------------------------------------
//

if (!isVerbose) {
	// To get a better grip on logging by either gulp-util, console.log or direct
	// writing to process.stdout, a hook is applied to stdout when not running
	// in --vebose mode
	require('./lib/hook.js')(process.stdout).hook('write', function (msg, encoding, fd, write) {

		// Validate message
		msg = validForWrite(msg);

		// If the message is not suited for output, block it
		if (!msg) {
			return;
		}

		if (msg.length === 1) return;
		
		// There is no progress bar, so just write
		if (_.isNull(bar)) {
			write(msg);
			return;
		}
		
		// There is a progress bar, but it hasn't completed yet, so buffer
		if (!bar.complete) {
			stdoutBuffer.push(msg);
			return;
		}

		// There is a buffer, prepend a newline to the array
		if(stdoutBuffer.length) {
			stdoutBuffer.unshift('\n');
		}

		// Write out the buffer untill its empty
		while (stdoutBuffer.length) {
			write(stdoutBuffer.shift());
		}

		// Finally, just write out
		write(msg);
	});

	// Map console.warn to console.log to make sure gulp-sassgraph errors
	// get validated by the code above
	/*console.warn = console.log; /*function () {

		var args = Array.prototype.slice.call(arguments);
		console.error('passing this to console.log: ', args);
		console.log.apply(console, args);
	}*/
}

// INIT -----------------------------------------------------------------------
//

gulp.task('init', function (cb) {

	// Get all files in working directory
	// Exclude . files (such as .DS_Store on OS X)
	var cwdFiles = _.remove(fs.readdirSync(cwd), function (file) {

		return file.substring(0,1) !== '.';
	});

	// If there are any files
	if (cwdFiles.length > 0) {

		// Make sure the user knows what is about to happen
		console.log(chalk.yellow.inverse('\nThe current directory is not empty!'));
		prompt({
			type:    'confirm',
			message: 'Initializing will empty the current directory. Continue?',
			name:    'override',
			default: false
		}, function (answer) {

			if (answer.override) {
				// Make really really sure that the user wants this
				prompt({
					type:    'confirm',
					message: 'Removed files are gone forever. Continue?',
					name:    'overridconfirm',
					default: false
				}, function (answer) {

					if (answer.overridconfirm) {
						// Clean up directory, then start downloading
						console.log(chalk.grey('\nEmptying current directory'));
						sequence('clean-tmp', 'clean-cwd', downloadBoilerplateFiles);
					}
					// User is unsure, quit process
					else process.exit(0);
				});
			}
			// User is unsure, quit process
			else process.exit(0);
		});
	}
	// No files, start downloading
	else {
		console.log('\n');
		downloadBoilerplateFiles();
	}

	cb(null);
});

// BUILD ----------------------------------------------------------------------
//

gulp.task('build', function (cb) {

	// Load the config.json file
	console.log(chalk.grey('\nLoading config.json...'));
	fs.readFile('config.json', 'utf8', function (err, data) {

		if (err) {
			console.log(chalk.red('✘  Cannot find config.json. Have you initiated Headstart through `headstart init?'), err);
			process.exit(0);
		}

		// Try parsing the config data as JSON
		try {
			config = JSON.parse(data);
		} catch (err) {
			console.log(chalk.red('✘  The config.json file is not valid json. Aborting.'), err);
			process.exit(0);
		}

		// Allow customization of gulp-htmlmin through `config.json`
		if (!_.isNull(config.htmlminOptions)) {
			htmlminOptions = _.assign({}, htmlminOptions, config.htmlminOptions);
		}

		assetsFolder = config.assetsFolder || assetsFolder;

		// Instantiate a progressbar when not in verbose mode
		if (!isVerbose) {
			bar = new ProgressBar(chalk.grey('Building ' + (isProduction ? 'production' : 'development') + ' version [:bar] :percent done'), {
				complete:   '#',
				incomplete: '-',
				total:      8
			});
			updateBar();
		} else {
			console.log(chalk.grey('Building ' + (isProduction ? 'production' : 'development') + ' version...'));
		}

		// Run build tasks
		// Serve files if Headstart was run with the --serve flag
		sequence(
			'clean-export',
			[
				'sass-main',
				'scripts-main',
				'images',
				'other'
			],
			'templates',
			'manifest',
			'uncss',
			function () {
				console.log(chalk.green((!isProduction ? '\n' : '') + '✔  Build complete'));
				if(isServe) {
					gulp.start('server');
				}
				cb(null);
			}
		);
	});
});

// CLEAN ----------------------------------------------------------------------
//

gulp.task('clean-export', function (cb) {

	// Remove export folder and files
	return gulp.src([
			config.export_templates,
			config.export_assets + '/' + assetsFolder
		], {read: false})
		.pipe(plugins.rimraf({force: true}))
		.on('end', updateBar)
	;
});

gulp.task('clean-cwd', function (cb) {

	// Remove cwd files
	return gulp.src(cwd + '/*', {read: false})
		.pipe(plugins.rimraf({force: true}))
	;
});

gulp.task('clean-tmp', function (cb) {

	// Remove temp folder
	return gulp.src(tmpFolder, {read: false})
		.pipe(plugins.rimraf({force: true}))
	;
});

gulp.task('clean-rev', function (cb) {

	verbose(chalk.grey('Running task "clean-rev"'));

	// Clean all revision files but the latest ones
	return gulp.src(config.export_assets + '/' + assetsFolder + '/**/*.*', {read: false})
		.pipe(plugins.revOutdated(1))
		.pipe(plugins.rimraf({force: true}))
	;
});


// SASS -----------------------------------------------------------------------
//

gulp.task('sass-main', ['sass-ie'], function (cb) {

	// Flag to catch empty streams
	// https://github.com/floatdrop/gulp-watch/issues/87
	var isEmptyStream = true;

	verbose(chalk.grey('Running task "sass-main"'));
	
	// Process the .scss files
	// While serving, this task opens a continuous watch
	return gulp.src([
				assetsFolder + '/sass/*.{scss, sass, css}',
				'!' + assetsFolder + '/sass/*ie.{scss, sass, css}'
			])
		.pipe(plugins.plumber())
		.pipe(plugins.rubySass({ style: (isProduction ? 'compressed' : 'nested') }))
		.pipe(plugins.if(config.combineMediaQueries, plugins.combineMediaQueries()))
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		// TODO: When minifyCSS bug is fixed, drop the noAdvanced feature
		// (https://github.com/jakubpawlowicz/clean-css/issues/375)
		.pipe(plugins.if(isProduction, plugins.minifyCss({ compatibility: 'ie8', noAdvanced: true })))
		.pipe(plugins.if(isProduction, plugins.rename({suffix: '.min'})))
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/css'))
		.on('data', function (cb) {

			// If revisioning is on, run templates again so the refresh contains
			// the newer stylesheet
			if (lrStarted && config.revisionCaching) {
				gulp.start('templates');
			}

			// Continue the stream
			this.resume();
		})
		.on('end', updateBar)
		.pipe(plugins.if(lrStarted && !config.revisionCaching, browserSync.reload({stream:true})))
	;
});

gulp.task('sass-ie', function (cb) {

	// Flag to catch empty streams
	// https://github.com/floatdrop/gulp-watch/issues/87
	var isEmptyStream = true;
	
	verbose(chalk.grey('Running task "sass-ie"'));
	
	// Process the .scss files
	// While serving, this task opens a continuous watch
	return gulp.src([
				assetsFolder + '/sass/*ie.{scss, sass, css}'
			])
		.pipe(plugins.plumber())
		.pipe(plugins.rubySass({ style: (isProduction ? 'compressed' : 'nested') }))
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/css'))
	;
});

// UNCSS ----------------------------------------------------------------------
// 
// Clean up unused CSS styles

gulp.task('uncss', function (cb) {
	
	// Quit this task if not configured through config
	if (!isProduction || !config.useUncss) {
		updateBar();
		cb(null);
		return;
	}

	verbose(chalk.grey('Running task "uncss-main"'));

	// Grab all templates / partials / layout parts / etc
	var templates = globule.find([config.export_templates + '/**/*.*']);

	// Grab all css files and run them through Uncss, then overwrite
	// the originals with the new ones
	return gulp.src(config.export_assets + '/' + assetsFolder + '/css/*.css')
		.pipe(plugins.bytediff.start())
		.pipe(plugins.uncss({
			html:   templates || [],
			ignore: config.uncssIgnore || []
		}))
		.pipe(plugins.bytediff.stop(function (data) {
			updateBar();

			data.percent = Math.round(data.percent*100);
			data.savings = Math.round(data.savings/1024);

			return chalk.grey('' + data.fileName + ' is now ') + chalk.green(data.percent + '% ' + (data.savings > 0 ? 'smaller' : 'larger')) + chalk.grey(' (saved ' + data.savings + 'KB)');
		}))
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/css'))
	;
});

// SCRIPTS --------------------------------------------------------------------
//

// JSHint options:	http://www.jshint.com/docs/options/
gulp.task('hint-scripts', function (cb) {
	
	// Quit this task if hinting isn't turned on
	if (!config.hint) {
		cb(null);
		return;
	}
	
	verbose(chalk.grey('Running task "hint-scripts"'));

	// Hint all non-lib js files and exclude _ prefixed files
	return gulp.src([
			assetsFolder + '/js/*.js',
			assetsFolder + '/js/core/*.js',
			'!_*.js'
		])
		.pipe(plugins.plumber())
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter(stylish))
	;
});

gulp.task('scripts-main', ['hint-scripts', 'scripts-view', 'scripts-ie'], function () {

	var files = [
		assetsFolder + '/js/libs/jquery*.js',
		assetsFolder + '/js/libs/ender*.js',

		(isProduction ? '!' : '') + assetsFolder + '/js/libs/dev/*.js',

		assetsFolder + '/js/libs/**/*.js',
		// TODO: remove later
		assetsFolder + '/js/core/**/*.js',
		//
		assetsFolder + '/js/*.js',
		'!' + assetsFolder + '/js/view-*.js',
		'!**/_*.js'
	];
	
	verbose(chalk.grey('Running task "scripts-main"'));

	if (isProduction) {
		var numFiles = globule.find(files).length;
		console.log(chalk.green('✄  Concatenated ' + numFiles + ' JS files'));
	}

	// Process .js files
	// Files are ordered for dependency sake
	return gulp.src(files, {base: '' + assetsFolder + '/js'})
		.pipe(plugins.plumber())
		.pipe(plugins.deporder())
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.if(isProduction, plugins.concat('core-libs.js')))
		.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(plugins.if(isProduction, plugins.rename({extname: '.min.js'})))
		.pipe(plugins.if(isProduction, plugins.uglify()))
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/js'))
		.on('end', updateBar)
	;
});

gulp.task('scripts-view', function (cb) {
	
	verbose(chalk.grey('Running task "scripts-view"'));

	return gulp.src(assetsFolder + '/js/view-*.js')
		.pipe(plugins.plumber())
		.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(plugins.if(isProduction, plugins.rename({suffix: '.min'})))
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.if(isProduction, plugins.uglify()))
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/js'))
	;
});

gulp.task('scripts-ie', function (cb) {
	
	verbose(chalk.grey('Running task "scripts-ie"'));

	// Process .js files
	// Files are ordered for dependency sake
	gulp.src([
		assetsFolder + '/js/ie/head/**/*.js',
		'!**/_*.js'
	])
		.pipe(plugins.plumber())
		.pipe(plugins.deporder())
		.pipe(plugins.concat('ie-head.js'))
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.rename({extname: '.min.js'}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/js'));

	gulp.src([
		assetsFolder + '/js/ie/body/**/*.js',
		'!**/_*.js'
	])
		.pipe(plugins.plumber())
		.pipe(plugins.deporder())
		.pipe(plugins.concat('ie-body.js'))
		.pipe(plugins.if(isProduction, plugins.stripDebug()))
		.pipe(plugins.rename({extname: '.min.js'}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/js'));

	cb(null);
});

// IMAGES ---------------------------------------------------------------------
//

gulp.task('images', function (cb) {
	
	verbose(chalk.grey('Running task "images"'));

	// Make a copy of the favicon.png, and make a .ico version for IE
	// Move to root of export folder
	gulp.src(assetsFolder + '/images/icons/favicon.png')
		.pipe(plugins.rename({extname: '.ico'}))
		//.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(gulp.dest(config.export_misc))
	;

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	return gulp.src([
			assetsFolder + '/images/**/*',
			'!_*'
		])
		.pipe(plugins.plumber())
		.pipe(plugins.newer(config.export_assets + '/' + assetsFolder + '/images'))
		.pipe(plugins.if(isProduction, plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		//.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder + '/images'))
		.pipe(plugins.if(lrStarted, browserSync.reload({stream:true})))
	;
});

// OTHER ----------------------------------------------------------------------
//

gulp.task('other', ['misc'], function (cb) {
	
	verbose(chalk.grey('Running task "other"'));

	// Make sure other files and folders are copied over
	// eg. fonts, videos, ...
	return gulp.src([
			assetsFolder + '/**/*',
			'!' + assetsFolder + '/sass',
			'!' + assetsFolder + '/sass/**/*',
			'!' + assetsFolder + '/js/**/*',
			'!' + assetsFolder + '/images/**/*',
			'!_*'
		])
		.pipe(plugins.plumber())
		//.pipe(plugins.if(config.revisionCaching, plugins.rev()))
		.pipe(gulp.dest(config.export_assets + '/' + assetsFolder))
		.on('end', updateBar)
	;
});

// MISC -----------------------------------------------------------------------
//
 
gulp.task('misc', function (cb) {
	
	// In --production mode, copy over all the other stuff
	if (isProduction) {
		verbose(chalk.grey('Running task "misc"'));

		// Make a functional version of the htaccess.txt
		gulp.src('misc/htaccess.txt')
			.pipe(plugins.rename('.htaccess'))
			.pipe(gulp.dest(config.export_misc))
		;

		gulp.src(['misc/*', '!misc/htaccess.txt', '!_*'])
			.pipe(gulp.dest(config.export_misc))
		;
	}

	cb(null);
});

// TEMPLATES ------------------------------------------------------------------
//
 
gulp.task('templates', ['clean-rev'], function (cb) {
	
	verbose(chalk.grey('Running task "templates"'));

	// If assebly is off, export all folders and files
	if (!config.assemble_templates) {
		gulp.src(['templates/**/*', '!templates/*.*', '!_*'])
			.pipe(gulp.dest(config.export_templates));
	}

	// Find number of "root" templates to parse and keep count
	var numTemplates = globule.find(['templates/*.*', '!_*']).length,
		count = 0,
		unvalidatedFiles = [];

	// Go over all root template files
	gulp.src(['templates/*.*', '!_*'])
		.pipe(plugins.tap(function (htmlFile) {

			var
				// Extract bits from filename
				baseName =     path.basename(htmlFile.path),
				nameParts =    baseName.split('.'),
				ext =          _.without(nameParts, _.first(nameParts)).join('.'),
				viewBaseName = _.last(nameParts[0].split('view-')),
				// Make sure Windows paths work down below
				cwdParts =     cwd.replace(/\\/g, '/').split('/'),

				// Make a collection of file globs
				// Production will get 1 file only
				// Development gets raw base files 
				injectItems =  isProduction ?
					[
						config.export_assets + '/' + assetsFolder + '/js/core-libs*.min.js',
						config.export_assets + '/' + assetsFolder + '/js/view-' + viewBaseName + '*.min.js'
					]
					:
					[
						config.export_assets + '/' + assetsFolder + '/js/libs/jquery*.js',
						config.export_assets + '/' + assetsFolder + '/js/libs/ender*.js',

						(isProduction ? '!' : '') + config.export_assets + '/' + assetsFolder + '/js/libs/dev/*.js',

						config.export_assets + '/' + assetsFolder + '/js/libs/*.js',
						config.export_assets + '/' + assetsFolder + '/js/core/*.js',
						config.export_assets + '/' + assetsFolder + '/js/**/*.js',

						'!' + config.export_assets + '/' + assetsFolder + '/**/_*.js',
						'!' + config.export_assets + '/' + assetsFolder + '/js/ie*.js'
					]
			;

			// Include the css
			injectItems.push(config.export_assets + '/' + assetsFolder + '/css/main*.css');
			injectItems.push(config.export_assets + '/' + assetsFolder + '/css/view-' + viewBaseName + '*.css');

			// Put items in a stream and order dependencies
			injectItems = gulp.src(injectItems)
				.pipe(plugins.plumber())
				.pipe(plugins.ignore.include(function (file) {

					var fileBase = path.basename(file.path);

					// Exclude filenames with "view-" not matching the current view
					if (fileBase.indexOf('view-') > -1 && fileBase.indexOf('.js') > -1 && fileBase.indexOf(viewBaseName) < 0) {
						return false;
					}

					// Pass through all the other files
					return true;
				}))
				.pipe(plugins.deporder(baseName));

			// On the current template
			gulp.src('templates/' + baseName)
				.pipe(plugins.plumber())
				// Piping plugins.newer() blocks refreshes on partials and layout parts :(
				//.pipe(plugins.newer(config.export_templates + '/' + baseName))
				.pipe(plugins.if(config.assemble_templates, plugins.compileHandlebars({
						templateName: baseName
					}, {
						batch:   ['templates/layout', 'templates/partials'],
						helpers: {
							equal: function (v1, v2, options) {
								return (v1 == v2) ? options.fn(this) : options.inverse(this);
							}
						}
				})))
				.pipe(plugins.inject(injectItems, {
					ignorePath:   [
							_.without(cwdParts, cwdParts.splice(-1)[0]).join('/')
						].concat(config.export_assets.split('/')),
					addRootSlash: false,
					addPrefix:    config.template_asset_prefix || ''
				}))
				.pipe(plugins.if(config.w3c && ext === 'html', plugins.w3cjs({
					doctype: 'HTML5',
					charset: 'utf-8'
				})))
				.pipe(plugins.if(config.minifyHTML, plugins.htmlmin(htmlminOptions)))
				.pipe(gulp.dest(config.export_templates))
				.on('end', function () {
					// Since above changes are made in a tapped stream
					// We have to count to make sure everything is parsed
					count = count + 1;
					if (count == numTemplates) {
						// Reload when serving
						if (lrStarted) {
							browserSync.reload(/*{stream:true}*/);
						}

						// Update the loadbar
						updateBar();

						// Report unvalidated files
						if (unvalidatedFiles.length) {
							console.log(chalk.yellow('✘  Couldn\'t validate: ' + unvalidatedFiles.join(', ')));
							console.log(chalk.yellow.inverse('W3C validation only works for HTML files'));
						}

						// Report the end of this task
						cb(null);
					}
				})
			;

			if (config.w3c && ext !== 'html') {
				unvalidatedFiles.push(baseName);
			}
		}))
	;
});

// MANIFEST -------------------------------------------------------------------
//

gulp.task('manifest', function (cb) {
	
	// Quit this task if the revisions aren't turned on
	if (!config.revisionCaching) {
		updateBar();
		cb(null);
		return;
	}

	verbose(chalk.grey('Running task "manifest"'));

	return gulp.src([
		config.export_assets + '/' + assetsFolder + '/js/*',
		config.export_assets + '/' + assetsFolder + '/css/*'
	])
		.pipe(plugins.manifest({
			filename: 'app.manifest',
			exclude:  'app.manifest'
		}))
		.pipe(gulp.dest(config.export_misc))
		.on('end', updateBar)
	;
});

// SERVER ---------------------------------------------------------------------
//

gulp.task('server', ['browsersync'], function (cb) {
	
	verbose(chalk.grey('Running task "server"'));
	console.log(chalk.grey('Watching files...'));

	gulp.watch([assetsFolder + '/sass/**/*.{scss, sass, css}', '!' + assetsFolder + '/sass/*ie.{scss, sass, css}'], ['sass-main']).on('change', watchHandler);
	gulp.watch([assetsFolder + '/js/**/view-*.js'], ['scripts-view', 'templates']).on('change', watchHandler);
	gulp.watch([assetsFolder + '/js/**/*.js', '!**/view-*.js'], ['scripts-main', 'templates']).on('change', watchHandler);
	gulp.watch([assetsFolder + '/images/**/*'], ['images']).on('change', watchHandler);
	gulp.watch(['templates/**/*'], ['templates']).on('change', watchHandler);

	cb(null);
});

gulp.task('browsersync', function (cb) {
	
	verbose(chalk.grey('Running task "browsersync"'));
	console.log(chalk.grey('Launching server...'));

	// Grab the event emitter and add some listeners
	var evt = browserSync.emitter;
	evt.on('init', bsInitHandler);
	evt.on('service:running', bsRunningHandler);

	// Serve files and connect browsers
	browserSync.init(null, {
		server:         _.isUndefined(config.proxy) ? {
							baseDir: config.export_templates
						} : false,
		logConnections: false,
		logLevel:       'silent', // 'debug'
		browser:        config.browser || 'default',
		open:           isOpen,
		port:           config.port || 3000,
		proxy:          config.proxy || false,
		tunnel:         isTunnel || null
	}, function (err, data) {

		// Use this callback to catch errors, which aren't transmitted
		// through `init`
		if (err !== null) {
			console.log(
				chalk.red('✘  Setting up a local server failed... Please try again. Aborting.\n') +
				chalk.red(err)
			);
			process.exit(0);
		}

		cb(null);
	});
});

// PAGESPEED INSIGHTS ---------------------------------------------------------
//

gulp.task('psi', function (cb) {

	// Quit this task if no flag was set
	if(!isPSI) {
		cb(null);
		return;
	}

	verbose(chalk.grey('Running task "psi"'));
	console.log(chalk.grey('Running PageSpeed Insights (might take a while)...'));

	// Define PSI options
	var opts = {
		url:       tunnelUrl,
		strategy:  flags.strategy || "desktop",
		threshold: 80
	};

	// Set the key if one was passed in
	if (!!flags.key && _.isString(flags.key)) {
		console.log(chalk.yellow.inverse('Using a key is not yet supported as it just crashes the process. For now, continue using `--psi` without a key.'));
		// TODO: Fix key
		//opts.key = flags.key;
	}

	// Run PSI
	psi(opts, function (err, data) {

		// If there was an error, log it and exit
		if (err !== null) {
			console.log(chalk.red('✘  Threshold of ' + opts.threshold + ' not met with score of ' + data.score));
		} else {
			console.log(chalk.green('✔  Threshold of ' + opts.threshold + ' exceeded with score of ' + data.score));
		}

		cb(null);
	});
});

// HELPER FUNCTIONS -----------------------------------------------------------
//

// Download the boilerplate files
function downloadBoilerplateFiles () {

	console.log(chalk.grey('Downloading boilerplate files...'));

	// If a custom repo was passed in, use it
	if (!!flags.base) {

		// Check if there's a slash
		if (flags.base.indexOf('/') < 0) {
			console.log(chalk.red('✘  Please pass in a correct repository, eg. `username/repository` or `user/repo#branch. Aborting.\n'));
			process.exit(0);
		}

		// Check if there's a reference
		if (flags.base.indexOf('#') > -1) {
			flags.base    = flags.base.split('#');
			gitConfig.ref = flags.base[1];
			flags.base    = flags.base[0];
		} else {
			gitConfig.ref = null;
		}

		// Extract username and repo
		flags.base     = flags.base.split('/');
		gitConfig.user = flags.base[0];
		gitConfig.repo = flags.base[1];

		// Extra validation
		if (gitConfig.user.length <= 0) {
			console.log(chalk.red('✘  The passed in username is invald. Aborting.\n'));
			process.exit(0);
		}
		if (gitConfig.repo.length <= 0) {
			console.log(chalk.red('✘  The passed in repository is invald. Aborting.\n'));
			process.exit(0);
		}
	}

	// Download the boilerplate files to a temp folder
	// This is to prevent a ENOEMPTY error
	ghdownload(gitConfig, tmpFolder)
		// Let the user know when something went wrong
		.on('error', function (error) {
			console.log(chalk.red('✘  An error occurred. Aborting.'), error);
			process.exit(0);
		})
		// Download succeeded
		.on('end', function () {
			console.log(
				chalk.green('✔ Download complete!\n') +
				chalk.grey('Cleaning up...')
			);

			// Move to working directory, clean temp, finish init
			ncp(tmpFolder, cwd, function (err) {

				if (err) {
					console.log(chalk.red('✘  Something went wrong. Please try again'), err);
					process.exit(0);
				}

				sequence('clean-tmp', function () {
					finishInit();
				});
			});
		})
		// TODO: Try to catch the error when a ZIP has "NOEND"
	;
}

// Wrap up after running init and
// downloading the boilerplate files
function finishInit () {

	// Ask the user if he wants to continue and
	// have the files served and opened
	prompt({
			type:    'confirm',
			message: 'Would you like to have these files served?',
			name:    'build',
			default: true
	}, function (buildAnswer) {

		if (buildAnswer.build) {
			isServe = true;
			prompt({
					type:    'confirm',
					message: 'Should they be opened in the browser?',
					name:    'open',
					default: true

			}, function (openAnswer) {

				if (openAnswer.open) isOpen = true;
				prompt({
					type:    'confirm',
					message: 'Should they be opened in an editor?',
					name:    'edit',
					default: true

				}, function (editAnswer) {

					if (editAnswer.edit) isEdit = true;
					gulp.start('build');
				});
			});
		}
		else process.exit(0);
	});
}

// Update the loadbar if one is set
function updateBar () {
	if (!isVerbose && bar !== null) {
		bar.tick();
	}
}

// Handle change events for Gulp watch instances
function watchHandler (e) {
	console.log(chalk.grey('"' + e.path.split('/').pop() + '" was ' + e.type));
}

// Browser Sync `init` event handler
function bsInitHandler (data) {

	// Store started state globally
	lrStarted = true;

	// Show some logs
	console.log(chalk.cyan('🌐  Local access at'), chalk.magenta(data.options.urls.local));
	console.log(chalk.cyan('🌐  Network access at'), chalk.magenta(data.options.urls.external));

	if (isOpen) {
		console.log(
			chalk.cyan('☞  Opening in'),
			chalk.magenta(config.browser)
		);
	}

	// Open an editor if needed
	if (isEdit) {
		openEditor();
	}
}

// Browser Sync `service:running event handler
function bsRunningHandler (data) {

	if (data.tunnel) {
		tunnelUrl = data.tunnel;
		console.log(chalk.cyan('🌐  Public access at'), chalk.magenta(tunnelUrl));

		if (isPSI) {
			gulp.start('psi');
		}
	} else if (isPSI) {
		console.log(chalk.red('✘  Running PSI cannot be started without a tunnel. Please restart Headstart with the `--tunnel` or `t` flag.'));
	}
}

// Open files in editor
function openEditor () {

	console.log(
		chalk.cyan('☞  Editing in'),
		chalk.magenta(config.editor)
	);
	open(cwd, config.editor);
}

// Make extra logs in verbose mode
function verbose (msg) {

	if(isVerbose) console.log(msg);
}

// Check if the passed in string may be logged out
function validForWrite (msg, cleanMsg) {

	cleanMsg = chalk.stripColor(msg);

	// Detect gulp-util "[XX:XX:XX] ..." logs, 
	if (/^\[[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}\]/.test(cleanMsg)) {
		var allowFlag = false;

		// Allow gulp-ruby-sass errors,
		// but format them a bit
		if (cleanMsg.indexOf('was changed') > -1) {
			msg = cleanMsg.split(' ');
			msg.shift();
			msg[0] = msg[0].split('/').pop();
			msg = msg.join(' ').trim();
			msg = chalk.grey(msg) + '\n';

			allowFlag = true;
		}

		// Allow gulp-plumber errors,
		// but format them a bit
		if (!allowFlag && cleanMsg.indexOf('Plumber found') > - 1) {
			msg = cleanMsg.split('Plumber found unhandled error:').pop().trim();
			msg = chalk.red.inverse('ERROR') + ' ' + msg + '\n';

			allowFlag = true;
		}

		// Grab the result of gulp-imagemin
		if (!allowFlag && cleanMsg.indexOf('gulp-imagemin: Minified') > -1) {
			msg = cleanMsg.split('gulp-imagemin:').pop().trim();
			msg = chalk.green('✄  ' + msg) + '\n';

			allowFlag = true;
		}

		// Allow W3C validation errors,
		// but format them a bit
		if (!allowFlag && cleanMsg.indexOf('HTML Error:') > -1) {
			msg = cleanMsg.split('HTML Error:').pop().trim();
			msg = chalk.red.inverse('HTML ERROR') + ' ' + msg + '\n';

			allowFlag = true;
		}

		// Grab the result of CSSMin
		if (!allowFlag && cleanMsg.indexOf('.css is now') > -1) {
			msg = cleanMsg.split(' ').slice(1).join(' ').trim();
			msg = chalk.green('✄  ' + msg) + '\n';

			allowFlag = true;
		}

		// Block all the others
		if (!allowFlag) {
			return false;
		}
	}

	// Block sass-graph errors
	var graphMatches = _.filter(['failed to resolve', 'failed to add'], function (part) {
		return cleanMsg.indexOf(part) > -1;
	});
	if (/^failed to resolve|failed to add/.test(msg)) {
		return false;
	}

	return msg;
}
