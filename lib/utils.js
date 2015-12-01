'use strict';

var deps        = require('./dependencies');
var cli         = require('./cli');
var settings    = require('./settings');

var c           = deps.chalk;
var _           = deps.lodash;
var cache       = null;
var cacheSplit  = settings.config.dist.root + '/';

// Shared private/public method to generate injects
function _generateInject (isScript, filePath) {
	if (isScript) {
		return `<script src="${filePath}"></script>`;
	}
	return `<link rel="stylesheet" href="${filePath}">`;
}

// Set exports
exports = module.exports = {
	// Analyse an asset
	analyseAsset: function (asset) {
		return {
			isCommon:  asset.path.indexOf('common') > -1,
			isView:    asset.path.indexOf('view') > -1,
			viewName:  asset.path.split('view/').pop().split('/').shift(),
			isIE:      asset.path.indexOf('ie/') > -1,
			ieVersion: asset.path.split('ie/').pop().split('/').shift(),
			isHead:    asset.path.indexOf('head') > -1,
			isBody:    asset.path.indexOf('body') > -1
		};
	},

	// Cache a piped asset
	cacheAsset: function (assetPath, analysis) {
		cache = cache || {};
		assetPath = assetPath.split(cacheSplit).pop();

		// Check if we're dealing with an IE asset
		if (analysis.isIE) {
			// Prepare new Objects or Arrays if needed
			cache.ie = cache.ie || {};
			cache.ie[analysis.ieVersion] = cache.ie[analysis.ieVersion] || {};
			cache.ie[analysis.ieVersion].head = cache.ie[analysis.ieVersion].head || [];
			cache.ie[analysis.ieVersion].body = cache.ie[analysis.ieVersion].body || [];

			// Assign the asset to either head or body
			if (analysis.isHead) {
				cache.ie[analysis.ieVersion].head.push(assetPath);
			} else if (analysis.isBody) {
				cache.ie[analysis.ieVersion].body.push(assetPath);
			}

			// Make sure we only keep unique values
			cache.ie[analysis.ieVersion].head = _.unique(cache.ie[analysis.ieVersion].head);
			cache.ie[analysis.ieVersion].body = _.unique(cache.ie[analysis.ieVersion].body);

			return;
		}

		// Check if we're dealing with a view
		if (analysis.isView) {
			// Prepare and Object or Array if needed
			cache.view = cache.view || {};
			cache.view[analysis.viewName] = cache.view[analysis.viewName] || [];

			// Add the asset
			cache.view[analysis.viewName].push(assetPath);

			// Make sure we only keep unique values
			cache.view[analysis.viewName] = _.unique(cache.view[analysis.viewName]);

			return;
		}

		// Assign all other assets to the common scope
		cache.common = cache.common || [];
		cache.common.push(assetPath);

		// And once again remove duplicates
		cache.common = _.unique(cache.common);
	},

	// Pop the cache by returning it
	dumpAssetCache: function (destroy) {
		var clone = deps.lodash.assign({}, cache);
		if (destroy === true) {
			cache = null;
		}

		return clone;
	},

	// Remove specific assets from the cache
	uncacheAssetType: function (ext, cacheObj) {
		var items = [];
		cacheObj = cacheObj || cache;

		_.each(cacheObj, function (cacheItem, key, collection) {
			// If the item is an Object, recursively dive in
			if (_.isObject(cacheItem)) {
				this.uncacheAssetType(ext, cacheItem);
				return;
			}

			// Store the item key if the extensions match
			if (deps.path.extname(cacheItem) === ext) {
				items.push(cacheItem);
			}
		}, this);

		// Go over the collected keys and remove them from the collection
		// Note: this could not be done in the previous `_.each` since
		// that displaced the next key and stopped one item early
		_.each(items, function (item) {
			_.pull(cacheObj, item);
		});
	},

	// Generate a <link> or <script> node for a file
	// TODO: Implement async
	generateInject: _generateInject,

	// Generate an IE conditional comment
	generateConditional: function (target, files) {
		var version = target.split('gte').pop().split('lte').pop().split('lt').pop().split('gt').pop();
		var modifier = version === target ? '' : target.split(version).shift();
		var res = '';

		// Check for valid folder name (should contain both a
		// version _and_ modifier, so they can't be equal)
		if (modifier === target) {
			console.warn(deps.chalk.yellow(`Folder ./src/common/ie/"${target}" is not valid. Ignoring files.`));
			return '';
		}

		// Add a space if there is a modifier
		if (modifier !== '') {
			modifier = modifier + ' ';
		}

		// Set up the conditional start
		res = `<!--[if ${modifier}IE ${version}]>\n`;

		deps.lodash.forEach(files, function (ieFilePath) {
			res += _generateInject(deps.path.extname(ieFilePath).substr(1) === 'js', ieFilePath) + '\n';
		});

		// Append the conditional end
		res += '<![endif]-->\n';
		return res;
	},

	// Used as custom handler for gulp-plumber
	// Logs errors without mentioning "plumber"
	errorHandler: function (err) {
		console.log(deps.chalk.red('Error —'), err);
	}

	// // Validate a repository and map it to the settings module
	// validateRepo: function (repoString) {
	// 	// Check for a slash
	// 	if (repoString.) {
	// 		return c.red('Expecting `username/repository` or `user/repo#tag. (Hit backspace to continue)');
	// 	}
	// 	// Set the setting git object and confirm validity
	// 	return true;
	// }
};
