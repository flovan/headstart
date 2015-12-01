// Module to minify graphical assets in a stream
//
// Blatantly stolen from https://github.com/sindresorhus/gulp-imagemin, but
// without gulp-util since that module is a pain in the @$$ to override

'use strict';

var path        = require('path');
var through     = require('through2');
var prettyBytes = require('pretty-bytes');
var chalk       = require('chalk');
var Imagemin    = require('imagemin');

module.exports = function (opts) {
	var validExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new Error('gulp-imagemin', 'Streaming not supported'));
			return;
		}

		if (validExts.indexOf(path.extname(file.path).toLowerCase()) === -1) {
			if (opts.verbose) {
				console.log(chalk.yellow('Skipping compression for unsupported image ' + file.relative));
			}

			cb(null, file);
			return;
		}

		var imagemin = new Imagemin()
			.src(file.contents)
			.use(Imagemin.gifsicle({interlaced: opts.interlaced}))
			.use(Imagemin.jpegtran({progressive: opts.progressive}))
			.use(Imagemin.optipng({optimizationLevel: opts.optimizationLevel}))
			.use(Imagemin.svgo({
				plugins: opts.svgoPlugins || [],
				multipass: opts.multipass
			}));

		if (opts.use) {
			opts.use.forEach(imagemin.use.bind(imagemin));
		}

		imagemin.run(function (err, files) {
			if (err) {
				cb(new Error('imagemin:', err, {fileName: file.path}));
				return;
			}

			var originalSize = file.contents.length;
			var optimizedSize = files[0].contents.length;
			var saved = originalSize - optimizedSize;
			var percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
			var savedMsg = 'Saved ' + prettyBytes(saved) + ' (' + percent.toFixed(1).replace(/\.0$/, '') + '%)';

			if (saved > 0) {
				console.log(savedMsg + ' while compressing ' + file.relative);
			}

			file.contents = files[0].contents;
			cb(null, file);
		});
	});
};