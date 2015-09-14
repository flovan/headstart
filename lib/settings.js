'use strict';

var
	deps      = require('../lib/dependencies'),
	pkg       = require('../package.json'),

	gitConfig = {
		user: null,
		repo: null,
		tag: null
	},
	flags     = deps.minimist(process.argv.slice(2))
;

// Set exports
exports = module.exports = {
	cwd:              process.cwd(),
	global:           new deps.Configstore(pkg.name),
	lrStarted:        false,
	isProduction:     flags.production || flags.p || false,
	isServe:          flags.serve || flags.s || false,
	isVerbose:        flags.verbose || false,
	isTunnel:         flags.tunnel || flags.t || false,
	tunnelUrl:        null,
	config:           null,
	prefixBrowsers:   ['> 1%', 'last 2 versions', 'Firefox 28', 'Opera 12.1', 'ie 9'],

	setGitConfig: function (user, repo, tag) {
		gitConfig.user = user;
		gitConfig.repo = repo;
		gitConfig.tag = tag;
	},

	getGitConfig: function () {
		return gitConfig;
	}
};