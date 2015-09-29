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
	repo:             'https://github.com/flovan/headstart-boilerplate#major-release-v2',
	tmpFolder:        '.tmp',
	flags:            flags,
	isProduction:     flags.production || flags.p || false,
	isServe:          flags.serve || flags.s || false,
	isVerbose:        flags.verbose || false,
	isTunnel:         flags.tunnel || flags.t || false,
	tunnelUrl:        null,
	lrStarted:        false,
	config:           {
		development: {
			hint:           true,
			templating:     true,
			assetPrefix:    '',
			prefixBrowsers: ['> 1%', 'last 2 versions', 'Firefox 28', 'Opera 12.1', 'ie 9'],
			sassOptions: {
				outputStyle: 'nested'
			},
			cssMinifyOptions: {

			},
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
		},
		production: {
			minifyHTML:     false,
			minifyCSS:      true,
			minifyJS:       true,
			revision:       true
		},
		favicons: {
			master:         'icon-master/favicon-master-600x600.png',
			silhouette:     'icon-master/favicon-silhouette-600x600.png',
			tileColor:      '#179F9F'
		},
		dist: {
			assets:         'export/assets',
			styles:         'css',
			script:         'js',
			imgFolder:      'img',
			templates:      'export',
			root:           'export'
		}
	}
};