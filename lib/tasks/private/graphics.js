'use strict';

// Require modules

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings'),

	conf                = settings.config,
	rfi,
	templates
;

// Define task

deps.taker.task('graphics', function (cb) {
	cli.toggleTaskSpinner('Moving images');

	// Grab all image files, filter out the new ones and copy over
	// In --production mode, optimize them first
	return deps.vfs.src([
			'src/common/img/**/*',
			'!_*'
		])
		// .pipe(deps.plumber())
		// .pipe(deps.plugins.newer(settings.config.exportAssetsImages))
		// .pipe(deps.if(settings.isProduction, deps.plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		// .pipe(deps.if(settings.config.revisionCaching, deps.rev()))
		.pipe(deps.vfs.dest(conf.dist.assets + '/' + conf.dist.imgFolder))
		// .pipe(deps.if(settings.lrStarted, deps.browserSync.reload({stream:true})))
	;
});

// deps.gulp.task('favicons', function (cb) {
// 	cli.toggleTaskSpinner('Generating favicons');

// 	if (settings.config.favicons) {
// 		// Grab all generated root html or php files
// 		templates = settings.templatesFolder + '/partials/favicon-meta-tags.html';//deps.globule.find(['*.html', '*.php'], {srcBase: settings.config.exportTemplates, prefixBase: true});
// 		// If there are any
// 		if (templates.length) {
// 			// Generate favicons through RealFaviconGenerator
// 			// Options: https://github.com/RealFaviconGenerator/grunt-real-favicon
// 			deps.realFavicon({
// 				src: settings.config.favicons.master || 'assets/images/_tpl/favicon-master-600x600.png',
// 				dest: settings.config.favicons.dest,
// 				icons_path: settings.assetsFolder + '/images/meta/',
// 				html: templates,
// 				design: {
// 					desktop_browser: {},
// 					ios: {
// 						picture_aspect: 'no_change'
// 					},
// 					windows: {
// 						master_picture: {
// 							src: settings.config.favicons.silhouette || 'assets/images/_tpl/favicon-silhouette-600x600.png',
// 						},
// 						picture_aspect: 'no_change',
// 						background_color: settings.config.favicons.tileColor || '#179F9F'
// 					}
// 				},
// 				settings: {
// 					compression: 0,
// 					scaling_algorithm: 'NearestNeighbor'
// 				},
// 				callback: function (html) {
// 					cb(null);
// 				}
// 			});
// 		} else {
// 			cb(null);
// 		}
// 	}
// });
