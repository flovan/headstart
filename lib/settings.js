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
		dev: {
			hint:           true,
			sassLintOrder:  [
				'box-sizing', 'content', 'display', 'position', 'top', 'right',
				'bottom', 'left', 'z-index', 'flex', 'flex-basis',
				'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink',
				'flex-wrap', 'align-content', 'align-items', 'align-self',
				'justify-content','order', 'width', 'min-width', 'max-width',
				'height', 'min-height', 'max-height', 'margin', 'margin-top',
				'margin-right', 'margin-bottom', 'margin-left', 'padding',
				'padding-top', 'padding-right', 'padding-bottom',
				'padding-left', 'float', 'clear', 'columns', 'column-gap',
				'column-fill', 'column-rule', 'column-span', 'column-count',
				'column-width', 'vertical-align', 'border', 'border-top',
				'border-right', 'border-bottom', 'border-left', 'border-width',
				'border-top-width', 'border-right-width',
				'border-bottom-width', 'border-left-width', 'border-style',
				'border-top-style', 'border-right-style',
				'border-bottom-style', 'border-left-style', 'border-radius',
				'border-top-left-radius', 'border-top-right-radius',
				'border-bottom-left-radius', 'border-bottom-right-radius',
				'border-color', 'border-top-color', 'border-right-color',
				'border-bottom-color', 'border-left-color', 'outline',
				'outline-color', 'outline-offset', 'outline-style',
				'outline-width', 'background', 'background-color',
				'background-image', 'background-repeat', 'background-position',
				'background-size', 'color', 'font', 'font-family', 'font-size',
				'font-smoothing', 'font-style', 'font-variant', 'font-weight',
				'letter-spacing', 'line-height', 'list-style', 'text-align',
				'text-decoration', 'text-indent', 'text-overflow',
				'text-rendering', 'text-shadow', 'text-transform', 'text-wrap',
				'white-space', 'word-spacing', 'border-collapse',
				'border-spacing', 'box-shadow', 'transform', 'transition',
				'caption-side', 'cursor', 'empty-cells', 'opacity', 'overflow',
				'quotes', 'speak', 'table-layout', 'visibility'
			],
			templating:     true,
			assetPrefix:    '',
			prefixBrowsers: [
				'> 1%', 'last 2 versions', 'Firefox 28', 'Opera 12.1', 'ie 9'
			],
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
			assets:         './export/assets',
			styles:         'css',
			script:         'js',
			imgFolder:      'img',
			templates:      './export',
			root:           './export'
		}
	}
};