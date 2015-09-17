'use strict';

var
	deps      = require('../lib/dependencies'),
	pkg       = require('../package.json'),

	flags     = deps.minimist(process.argv.slice(2))
;

// Set exports
exports = module.exports = {
	cwd:              process.cwd(),
	global:           new deps.Configstore(pkg.name),
	tmpFolder:        '.tmp',
	lrStarted:        false,
	flags:            flags,
	isProduction:     flags.production || flags.p || false,
	isServe:          flags.serve || flags.s || false,
	isVerbose:        flags.verbose || false,
	isTunnel:         flags.tunnel || flags.t || false,
	tunnelUrl:        null,
	config:           null,
	prefixBrowsers:   ['> 1%', 'last 2 versions', 'Firefox 28', 'Opera 12.1', 'ie 9'],
	repo:             'https://github.com/flovan/headstart-boilerplate#major-release-v2'
};