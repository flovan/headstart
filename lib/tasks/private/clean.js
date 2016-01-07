'use strict';

var deps     = require('../../dependencies');
var utils    = require('../../utils');
var cli      = require('../../cli');
var settings = require('../../settings');

var _        = deps.lodash;
var c        = deps.chalk;
var path     = deps.path;

// Define tasks

deps.taker.task('clean-cwd', function (cb) {
	console.log(c.gray('Cleaning directory'));

	deps.del(['./*', './.*']).then(function () {
		cb();
	});
});

deps.taker.task('clean-tmp', function (cb) {
	console.log(c.gray('Removing temporary folder'));

	deps.del(settings.tmpFolder).then(function () {
		cb();
	});
});

deps.taker.task('clean-export', function (cb) {
	console.log(c.gray('Cleaning export folder'));

	// Remove various export folders
	deps.del([
		settings.config.dist.assets,
		settings.config.dist.templates,
		settings.config.dist.root
	], { force: true }).then(function () {
		cb();
	});
});

//
// deps.taker.task('clean-rev', function (cb) {
// 	cli.toggleTaskSpinner('Removing old file revisions');
//
// 	// Clean all revision files but the latest ones
// 	return deps.undertaker.src(settings.config.exportAssets + '/' + settings.assetsFolder + '/**/*.*', {read: false})
// 		.pipe(deps.revOutdated(1))
// 		.pipe(deps.vinylPaths(deps.del))
// 	;
// });
