// Module to report files size differences throughout a stream
//
// Blatantly stolen from https://github.com/SkeLLLa/gulp-sizediff, but
// without gulp-util since that module is a pain in the @$$ to override

'use strict';

var through     = require('through2');
var path        = require('path');
var chalk       = require('chalk');
var prettyBytes = require('pretty-bytes');

function log (title, what, sizediff) {
	if (typeof sizediff === 'string') {
		gutil.log(title + ' ' + (what ? what + ' ' : '') + chalk.magenta(sizediff));
	} else {
		title = title ? ('\'' + chalk.cyan(title) + '\' ') : '';
		var stats = [prettyBytes(sizediff.startSize), ' / ',
			prettyBytes(sizediff.endSize), ' / ',
			prettyBytes(sizediff.diff), ' / ',
			Math.round(sizediff.diffPercent * 100) + '% / ',
			sizediff.compressionRatio.toFixed(2)].join('');

		gutil.log(title + ' ' + (what ? what + ' ' : '') + chalk.magenta(stats));
	}
}

function sizediff() {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError('gulp-sizediff', 'Streaming not supported'));
			return;
		}
		file.sizediff = {
			startSize: file.contents && file.contents.length || file.stats && file.stats.size || 0
		};
		cb(null, file)
	}, function(cb) {
		cb()
	});
}

sizediff.start = sizediff;

sizediff.stop = function (formatFn) {
	var totalSize = {
		start: 0,
		end: 0
	};
	var fileCount = 0;

	return through.obj(null, function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		var sizeDiff = file.sizediff;
		sizeDiff.endSize = file.contents && file.contents.length || file.stats && file.stats.size || 0;

		totalSize.start += sizeDiff.startSize;
		totalSize.end += sizeDiff.endSize;

		if (sizeDiff.endSize > 0) {
			sizeDiff.diff = sizeDiff.startSize - sizeDiff.endSize;
			sizeDiff.diffPercent = sizeDiff.endSize / sizeDiff.startSize * 100;
			sizeDiff.compressionRatio = sizeDiff.diff / sizeDiff.startSize;

			if (typeof formatFn === 'function') {
				formatFn(file.path, sizeDiff);
			} else {
				console.log(`Saved ${prettyBytes(sizeDiff.diff)} (${sizeDiff.diffPercent.toFixed(1)}%) while compressing ${path.basename(file.path)}`);
			}
		}

		fileCount++;
		cb(null, file);
	});

};

module.exports = sizediff;