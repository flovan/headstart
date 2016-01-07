'use strict';

var deps     = require('../../dependencies');
var utils    = require('../../utils');
var cli      = require('../../cli');
var settings = require('../../settings');

var _        = deps.lodash;

// Function to register all partials
function registerPartials () {
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
}

// Register "handlebars-layout" helpers
deps.layouts.register(deps.hb.handlebars);

// Register a custom helper to deal with asset injecting
deps.hb.handlebars.registerHelper('inject', function(data) {
	var filePath  = data.data.root.file.path;
	var viewName  = filePath.split('view/').pop().split('/').shift();
	var hash      = data.hash;
	var loc       = data.hash.location;
	var extFilter = loc === 'head' ? 'css' : 'js';
	var includes  = data.hash.include.replace(' ', '').split(',');
	var files     = utils.dumpAssetCache();
	var res       = `<!-- INJECT:${loc.toUpperCase()} -->\n`;

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
	console.log(deps.chalk.gray('Compiling templates'));

	// Register partials
	registerPartials();

	// Make a filter to handle asset files differently
	var assetFilter = deps.filter(function (file) {
		return /assets-(head|body)\..+/.test(file.path);
	}, {restore: true});

	// Contstruct the stream
	//
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

		// Compile through Handlebars when templating,
		.pipe(deps.if(settings.config.dev.templating, deps.hb({
			bustCache: settings.isServe
		})))

		// Filter out the designated asset files, and if we're not templating,
		// compile them through Handlebars
		.pipe(assetFilter)
		.pipe(deps.if(!settings.config.dev.templating, deps.hb({
			bustCache: settings.isServe
		})))
		.pipe(assetFilter.restore)

		// Flatten the directory structure when templating
		.pipe(deps.if(settings.config.dev.templating, deps.flatten()))

		// Write the files
		.pipe(deps.vfs.dest(settings.config.dist.templates))

		// Reload if a server is running
		.on('end', function (asset) {
			if (!!settings.server && settings.server.active) {
				settings.server.reload({ once: true });
			}
		})
	;
});
