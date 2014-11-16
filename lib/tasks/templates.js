'use strict';

// Require modules
// ----------------------------------------------------------------------------

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	settings            = require('../settings')
;

// Define Gulp task
// ----------------------------------------------------------------------------

deps.gulp.task('templates', ['clean-rev'], function (cb) {
	
	utils.verbose(deps.chalk.grey('Running task "templates"'));

	// If assebly is off, export all folders and files
	if (!settings.config.assemble_templates) {
		deps.gulp.src(['templates/**/*', '!templates/*.*', '!_*'])
			.pipe(deps.gulp.dest(settings.config.export_templates));
	}

	// Find number of "root" templates to parse and keep count
	var numTemplates = deps.globule.find(['templates/*.*', '!_*']).length,
		count = 0,
		unvalidatedFiles = [];

	// Go over all root template files
	deps.gulp.src(['templates/*.*', '!_*'])
		.pipe(deps.plugins.tap(function (htmlFile) {

			var
				// Extract bits from filename
				baseName =     deps.path.basename(htmlFile.path),
				nameParts =    baseName.split('.'),
				ext =          deps.lodash.without(nameParts, deps.lodash.first(nameParts)).join('.'),
				viewBaseName = deps.lodash.last(nameParts[0].split('view-')),
				// Make sure Windows paths work down below
				cwdParts =     settings.cwd.replace(/\\/g, '/').split('/'),

				// Make a collection of file globs
				// Production will get 1 file only
				// Development gets raw base files 
				injectItems =  settings.isProduction ?
					[
						settings.config.export_assets_js + '/core-libs*.min.js',
						settings.config.export_assets_js + '/view-' + viewBaseName + '*.min.js'
					]
					:
					[
						settings.config.export_assets_js + '/libs/jquery*.js',
						settings.config.export_assets_js + '/libs/ender*.js',

						(settings.isProduction ? '!' : '') + settings.config.export_assets_js + '/dev/**/*.js',

						settings.config.export_assets_js + '/libs/**/*.js',
						settings.config.export_assets_js + '/**/*.js',

						'!' + settings.config.export_assets_js + '/**/_*.js',
						'!' + settings.config.export_assets_js + '/ie/**',
						'!' + settings.config.export_assets_js + '/ie*.js'
					]
			;
 
			// Include the css
			injectItems.push(settings.config.export_assets_css + '/main*.css');
			injectItems.push(settings.config.export_assets_css + '/view-' + viewBaseName + '*.css');

			// Put items in a stream and order dependencies
			injectItems = deps.gulp.src(injectItems)
				.pipe(deps.plugins.plumber())
				.pipe(deps.plugins.ignore.include(function (file) {

					var fileBase = deps.path.basename(file.path);

					// Exclude filenames with "view-" not matching the current view
					if (fileBase.indexOf('view-') > -1 && fileBase.indexOf('.js') > -1 && fileBase.indexOf(viewBaseName) < 0) {
						return false;
					}

					// Pass through all the other files
					return true;
				}))
				.pipe(deps.plugins.deporder());

			// On the current template
			deps.gulp.src('templates/' + baseName)
				.pipe(deps.plugins.plumber())
				// Piping deps.plugins.newer() blocks refreshes on partials and layout parts :(
				//.pipe(deps.plugins.newer(settings.config.export_templates + '/' + baseName))
				.pipe(deps.plugins.if(settings.config.assemble_templates, deps.plugins.compileHandlebars({
						templateName: baseName
					}, {
						batch:   ['templates/layout', 'templates/partials'],
						helpers: {
							equal: function (v1, v2, options) {
								return (v1 == v2) ? options.fn(this) : options.inverse(this);
							}
						}
				})))
				.pipe(deps.plugins.inject(injectItems, {
					ignorePath:   settings.config.export_assets,
					addRootSlash: false,
					addPrefix:    settings.config.template_asset_prefix || ''
				}))
				.pipe(deps.plugins.if(settings.config.w3c && ext === 'html', deps.plugins.w3cjs({
					doctype: 'HTML5',
					charset: 'utf-8'
				})))
				.pipe(deps.plugins.if(settings.config.minifyHTML, deps.plugins.htmlmin(settings.htmlminOptions)))
				.pipe(deps.gulp.dest(settings.config.export_templates))
				.on('end', function () {
					// Since above changes are made in a tapped stream
					// We have to count to make sure everything is parsed
					count = count + 1;
					if (count == numTemplates) {
						// Reload when serving
						if (settings.lrStarted) {
							deps.browserSync.reload();
						}

						// Update the loadbar
						utils.updateBar();

						// Report unvalidated files
						if (unvalidatedFiles.length) {
							console.log(deps.chalk.yellow('✘  Couldn\'t validate: ' + unvalidatedFiles.join(', ')));
							console.log(deps.chalk.yellow.inverse('W3C validation only works for HTML files'));
						}

						// Report the end of this task
						cb(null);
					}
				})
			;

			if (settings.config.w3c && ext !== 'html') {
				unvalidatedFiles.push(baseName);
			}
		}))
	;
});