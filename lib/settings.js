'use strict';

var flags = require('minimist')(process.argv.slice(2));

exports = module.exports = {
		cwd:                process.cwd(),
		user:               process.env.USER,
		flags:              flags,
		tmpFolder:          '.tmp',
		assetsFolder:       'assets',
		imgFolder:          'images',
		jsFolder:           'js',
		cssFolder:          'css',
		stdoutBuffer:       [],
		lrStarted:          false,
		isRubySass:         ( flags.rubySass || flags.rs ) || false,
		isProduction:       ( flags.production || flags.p ) || false,
		isServe:            ( flags.serve || flags.s ) || false,
		isOpen:             ( flags.open || flags.o ) || false,
		isEdit:             ( flags.edit || flags.e ) || false,
		isVerbose:          flags.verbose || false,
		isTunnel:           ( flags.tunnel || flags.t ) || false,
		tunnelUrl:          null,
		isPSI:              flags.psi || false,
		config:             null,
		bar:                null,
		gitConfig:          {
								user: 'flovan',
								repo: 'headstart-boilerplate',
								ref:  '1.2.1'
							},
		htmlminOptions:     {
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