'use strict';

var
	deps = require('../lib/dependencies'),
	pkg  = require('../package.json'),

	flags,
	settings = {
		cwd:              process.cwd(),
		//package:          pkg,
		//assetsFolder:     'assets',
		//jsFolder:         'js',
		//cssFolder:        'css',
		//stdoutBuffer:     [],
		lrStarted:        false,
		tunnelUrl:        null,
		config:           null,
		//gitConfig:        {},
		prefixBrowsers:   ['> 1%', 'last 2 versions', 'Firefox 28', 'Opera 12.1', 'ie 9']
	}
;

// Get the global settings file through Configstore
settings.global = new deps.Configstore(pkg.name);

// Get and parse flags
flags = settings.flags = deps.minimist(process.argv.slice(2));

// Set boolean flags in the settings object
settings.isProduction = (flags.production || flags.p) || false;
settings.isServe = (flags.serve || flags.s) || false;
settings.isVerbose = flags.verbose || false;
settings.isTunnel = (flags.tunnel || flags.t) || false;

// Set exports
exports = module.exports = settings;