'use strict';

// Require modules

var
	deps = require('../lib/dependencies'),
	pkg  = require('../package.json')
;

// Define variables

var flags,
	settings = {
	cwd:             process.cwd(),
	tmpFolder:       '.tmp',
	assetsFolder:    'assets',
	imgFolder:       'images',
	jsFolder:        'js',
	cssFolder:       'css',
	templatesFolder: 'templates',
	stdoutBuffer:    [],
	lrStarted:       false,
	tunnelUrl:       null,
	config:          null,
	gitConfig:       {},
	htmlminOptions:  {
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

settings.isRubySass = (flags.rubySass || flags.rs) || false;
settings.isProduction = (flags.production || flags.p) || false;
settings.isServe = (flags.serve || flags.s) || false;
settings.isOpen = (flags.open || flags.o) || false;
settings.isEdit = (flags.edit || flags.e) || false;
settings.isVerbose = flags.verbose || false;
settings.isTunnel = (flags.tunnel || flags.t) || false;
settings.isPSI = flags.psi || false;

// Set exports

exports = module.exports = settings;
