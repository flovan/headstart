'use strict';

// Require modules

var
	deps                = require('../../dependencies'),
	utils               = require('../../utils'),
	cli                 = require('../../cli'),
	settings            = require('../../settings'),

	_                   = deps.lodash
;

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

// Register partials
deps.globule.find([
	'./src/layout/**/*.{html,php,hbs}',
	'./src/partial/**/*.{html,php,hbs}'
]).forEach(function (partialPath) {
	var
		partial = deps.fs.readFileSync(partialPath, 'utf8'),
		partialName = '' +
			deps.path.dirname(partialPath).split('/').pop() +
			'/' +
			deps.path.basename(partialPath).split('.').shift()
	;

	deps.hb.handlebars.registerPartial(partialName, partial);
});

// Define task
// TODO: this needs clean-rev
// TODO: Browser-reload
deps.taker.task('templates', function (cb) {
	cli.toggleTaskSpinner('Compiling templates');

	// Grab either the view files or ALL the files, depending
	// on whether templating is on or not
	return deps.vfs.src(settings.config.dev.templating ? [
			'src/view/**/*.{html,php,hbs}',
			'!_*'
		] : [
			'src/**/*.{html,php,hbs}',
			'!_*'
		])

		// Catch possible errors down the stream
		.pipe(deps.plumber({errorHandler: utils.errorHandler}))

		// Compile through Handlebars, busting the cache if needed
		.pipe(deps.hb({ bustCache: settings.isServe }))

		// Flatten the directory structure when templating
		.pipe(deps.if(settings.config.dev.templating, deps.flatten()))

		// Write the files
		.pipe(deps.vfs.dest(settings.config.dist.templates))
	;
});