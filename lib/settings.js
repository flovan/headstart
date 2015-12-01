'use strict';

var deps  = require('../lib/dependencies');
var pkg   = require('../package.json');

var flags = deps.minimist(process.argv.slice(2));

// Set exports
exports = module.exports = {
	cwd:          process.cwd(),
	global:       new deps.Configstore(pkg.name),
	repo:         'https://github.com/flovan/headstart-boilerplate#major-release-v2',
	tmpFolder:    '.tmp',
	flags:        flags,
	isProduction: flags.production || flags.p || false,
	isServe:      flags.serve || flags.s || false,
	isVerbose:    flags.verbose || false,
	isTunnel:     flags.tunnel || flags.t || false,
	tunnelUrl:    null,
	server:       null,
	config:       {
		dev: {
			templating:     true,
			reloadAlways:   true,
			assetPrefix:    '',
			sassOptions:    {
				outputStyle: 'nested'
			},
			prefixBrowsers: [
				'> 1%', 'last 2 versions', 'Firefox 28', 'Opera 12.1', 'ie 9'
			]
		},
		server: {
			proxy:          false,
			logConnections: false,
			logLevel:       'silent',
			port:           3000
		},
		production: {
			minifyHTML:            false,
			minifyHTMLOptions:     {
				removeComments:                true,
				collapseWhitespace:            true,
				collapseBooleanAttributes:     true,
				removeAttributeQuotes:         true,
				useShortDoctype:               true,
				removeScriptTypeAttributes:    true,
				removeStyleLinkTypeAttributes: true,
				minifyJS:                      true,
				minifyCSS:                     true
			},
			minifyCSS:             true,
			minifyCSSOptions:      {},
			minifyJS:              true,
			concatName:            'core-libs',
			allowDebug:            false,
			minifyGraphics:        true,
			minifyGraphicsOptions: {
				optimizationLevel: 3,
				progressive:       true,
				interlaced:        true,
				verbose:           true
			},
			revision:          true
		},
		dist: {
			assets:    'export/assets',
			styles:    'css',
			scripts:   'js',
			images:    'img',
			templates: 'export',
			root:      'export'
		}
	}
};