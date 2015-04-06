'use strict';

// Require modules

var
	deps = require('../lib/dependencies'),
	pkg  = require('../package.json')
;

// Define variables

var flags,
	settings = {
	cwd:              process.cwd(),
	package:          pkg,
	tmpFolder:        '.tmp',
	assetsFolder:     'assets',
	imgFolder:        'images',
	jsFolder:         'js',
	cssFolder:        'css',
	templatesFolder:  'templates',
	stdoutBuffer:     [],
	lrStarted:        false,
	tunnelUrl:        null,
	config:           null,
	gitConfig:        {},
	prefixBrowsers:   ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
	cssMinifyOptions: {},
	htmlminOptions:   {
		removeComments:                true,
		collapseWhitespace:            true,
		collapseBooleanAttributes:     true,
		removeAttributeQuotes:         true,
		useShortDoctype:               true,
		removeScriptTypeAttributes:    true,
		removeStyleLinkTypeAttributes: true,
		minifyJS:                      true,
		minifyCSS:                     true
	}
};

// Get the global settings file through Configstore

settings.global = new deps.Configstore(pkg.name);

// Get and parse flags

flags = settings.flags = deps.minimist(process.argv.slice(2));

settings.isProduction = (flags.production || flags.p) || false;
settings.isServe = (flags.serve || flags.s) || false;
settings.isRuby = (flags.ruby || flags.r) || false;
settings.isCompat = (flags.compatibility || flags.compat || flags.c) || false;
settings.isOpen = (flags.open || flags.o) || false;
settings.isEdit = (flags.edit || flags.e) || false;
settings.isVerbose = flags.verbose || false;
settings.isTunnel = (flags.tunnel || flags.t) || false;
settings.isPSI = flags.psi || false;

// Set exports

exports = module.exports = settings;
