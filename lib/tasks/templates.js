'use strict';

// REQUIRES -------------------------------------------------------------------

var
	_                   = require('lodash'),
	gulp                = require('gulp'),
	plugins             = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	}),
	utils               = require('./lib/utils')
;

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
						config.export_assets + '/assets/js/core-libs*.min.js',
						config.export_assets + '/assets/js/view-' + viewBaseName + '*.min.js'
					]
					:
					[
						config.export_assets + '/assets/js/libs/jquery*.js',
						config.export_assets + '/assets/js/libs/ender*.js',

						(isProduction ? '!' : '') + config.export_assets + '/assets/js/libs/dev/*.js',

						config.export_assets + '/assets/js/libs/*.js',
						config.export_assets + '/assets/js/core/*.js',
						config.export_assets + '/assets/js/**/*.js',

						'!' + config.export_assets + '/assets/**/_*.js',
						'!' + config.export_assets + '/assets/js/ie*.js'
					]
			;

			// Include the css
			injectItems.push(config.export_assets + '/assets/css/main*.css');
			injectItems.push(config.export_assets + '/assets/css/view-' + viewBaseName + '*.css');

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