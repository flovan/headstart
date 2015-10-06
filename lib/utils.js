'use strict';

var
	deps       = require('./dependencies'),
	cli        = require('./cli'),
	settings   = require('./settings'),

	c          = deps.chalk,
	cache      = null,
	cacheSplit = settings.config.dist.root + '/'
;

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

	// Cache a piped asset to
	cacheAsset: function (assetPath, analysis) {
		cache = cache || {};
		assetPath = assetPath.split(cacheSplit).pop();

		if (analysis.isIE) {
			cache.ie = cache.ie || {};
			cache.ie[analysis.ieVersion] = cache.ie[analysis.ieVersion] || {};
			cache.ie[analysis.ieVersion].head = cache.ie[analysis.ieVersion].head || [];
			cache.ie[analysis.ieVersion].body = cache.ie[analysis.ieVersion].body || [];

			if (analysis.isHead) {
				cache.ie[analysis.ieVersion].head.push(assetPath);
			} else if (analysis.isBody) {
				cache.ie[analysis.ieVersion].body.push(assetPath);
			}

			return;
		}

		if (analysis.isView) {
			cache.view = cache.view || {};
			cache.view[analysis.viewName] = cache.view[analysis.viewName] || [];
			cache.view[analysis.viewName].push(assetPath);
			return;
		}

		// isCommon)
		cache.common = cache.common || [];
		cache.common.push(assetPath);
	},

	// Pop the cache by returning it
	dumpAssetCache: function (destroy) {
		var clone = deps.lodash.assign({}, cache);
		if (destroy === true) {
			cache = null;
		}

		return clone;
	},

	// Generate a <link> or <script> node for a file
	// TODO: Implement async
	generateInject: _generateInject,

	// Generate an IE conditional comment
	generateConditional: function (target, files) {
		var
			version = target.split('gte').pop().split('lte').pop().split('lt').pop().split('gt').pop(),
			modifier = version === target ? '' : target.split(version).shift(),
			res = ''
		;

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

	// // Handle change events for Gulp watch instances
	//
	// watchHandler: function (e) {
	// 	console.log(c.grey('"' + e.path.split('/').pop() + '" was ' + e.type));
	// },
	//
	// // BrowserSync `init` event handler
	//
	// bsInitHandler: function (data) {
	// 	// Store started state globally
	// 	settings.lrStarted = true;
	//
	// 	// Show some logs
	// 	console.log(c.cyan('🌐  Local access at'), c.magenta(data.options.urls.local));
	// 	console.log(c.cyan('🌐  Network access at'), c.magenta(data.options.urls.external));
	// },
	//
	// // BrowserSync `service:running` event handler
	//
	// bsRunningHandler: function (data) {
	// 	if (data.tunnel) {
	// 		settings.tunnelUrl = data.tunnel;
	// 		console.log(c.cyan('🌐  Public access at'), c.magenta(tunnelUrl));
	//
	// 		if (settings.isPSI) {
	// 			deps.gulp.start('psi');
	// 		}
	// 	} else if (settings.isPSI) {
	// 		console.log(c.red('✘  Running PSI cannot be started without a tunnel. Please restart Headstart with the `--tunnel` or `t` flag.'));
	// 	}
	// }
};
