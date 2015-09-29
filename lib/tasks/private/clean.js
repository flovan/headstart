'use strict';

// Require modules

var
	deps     = require('../../dependencies'),
	utils    = require('../../utils'),
	cli      = require('../../cli'),
	settings = require('../../settings'),

	_        = deps.lodash
;

// Define tasks
deps.taker.task('clean-cwd', function (cb) {
	cli.toggleTaskSpinner('Cleaning directory');
	deps.del([settings.cwd + '/*', settings.tmpFolder]).then(function () {
		cb();
	});
});

deps.taker.task('clean-tmp', function (cb) {
	cli.toggleTaskSpinner('Removing temporary folder');
	deps.del(settings.tmpFolder).then(function () {
		cb();
	});
});

deps.taker.task('clean-export', function (cb) {
	cli.toggleTaskSpinner('Cleaning export folder');

	// Remove export folder and files
	deps.del(_.uniq(_.values(settings.config.dist))).then(function () {
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