'use strict';

// Require modules

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings'),

	_                   = deps.lodash
;

// transform.html.css = function (filepath) {
//   return '<link rel="stylesheet" href="' + filepath + '"' + end();
// };

// transform.html.js = function (filepath) {
//   return '<script src="' + filepath + '"></script>';
// };

// Register helpers
deps.layouts.register(deps.hb.handlebars);
deps.hb.handlebars.registerHelper('inject', function(data) {
	var
		filePath  = data.data.root.file.path,
		viewName  = filePath.split('view/').pop().split('/').shift(),
		hash      = data.hash,
		loc       = hash.location,
		extFilter = loc === 'head' ? 'css' : 'js',
		includes  = hash.include.replace(' ', '').split(','),
		files     = utils.dumpAssetCache(),
		res       = `<!-- INJECT:${loc.toUpperCase()} -->\n`
	;

	// Loop over all the cached files names, validating
	// variable type and length along the way
	//
	// TODO: Try to merge these loops
	// TODO: Async (loadCSS)
	//
	// Common files
	if (_.isArray(files.common) && files.common.length) {
		_.forEach(_.filter(files.common, function (filePath) {
			return deps.path.extname(filePath).substr(1) === extFilter;
		}), function (filePath) {
			res += utils.generateInject(extFilter === 'js', filePath) + '\n';
		});
	}
	// View files
	if (_.isObject(files.view) && _.isArray(files.view[viewName]) && files.view[viewName].length) {
		_.forEach(_.filter(files.view[viewName] || [], function (file) {
			return file.split('.').pop() === extFilter;
		}), function (file) {
			res += utils.generateInject(extFilter === 'js', file) + '\n';
		});
	}
	// IE files
	if (_.isObject(files.ie)) {
		_.forIn(files.ie, function (val, key) {
			if (_.isArray(val[loc]) && val[loc].length) {
				res += utils.generateConditional(key, val[loc]);
			}
		});
	}

	res += `<!-- /INJECT:${loc.toUpperCase()} -->\n`;
    return new deps.hb.handlebars.SafeString(res);
});

// Define task
// TODO: this needs clean-rev
deps.taker.task('templates', function (cb) {
	cli.toggleTaskSpinner('Compiling templates');

	var stream;

	if (!settings.config.dev.templating) {
		// If we're not templating, just move over all the source files
		stream = deps.vfs.src([
			'src/layout/**/*',
			'src/partial/**/*',
			'src/view/**/*'
		]).pipe(deps.vfs.dest(settings.config.dist.templates));
	} else {
		// Otherwise, compile them through handlebars
		// and use the handlebars-layout helpers
		stream = deps.vfs.src([
			'src/view/**/*.{html,php,hbs}',
			'!_*'
		])
			//.pipe(deps.plumber())
			.pipe(deps.hb({
				partials: [
					'./src/layout/**/*.{hbs,js}',
					'./src/partial/**/*.{hbs,js}'
				],
				bustCache: settings.isServe
			}))
			.on('error', function (err) {
				console.log(deps.chalk.red('Handlebars error:'), err.message);

				if (settings.isServe) {
					this.resume();
				} else {
					process.exit(1);
				}
			})
			.pipe(deps.flatten())
			.pipe(deps.vfs.dest(settings.config.dist.templates))
		;
	}

	// TODO: Browser-reload
	return stream;
});