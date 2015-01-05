'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define variables

var duo;

// Define Gulp task

deps.gulp.task('init', function (cb) {
	utils.loadConfig(function () {
		// Check if there is a configuration for Duo
		if (!settings.config.duo) {
			console.log(deps.chalk.yellow('No Duo configuration found, continuing...'));
			utils.finishInit();

			cb(null);
		}

		//cli.toggleTaskSpinner('Fetching JS dependencies (this might take a while)');

		// Make a new Duo instance at the current dir
		duo = new deps.Duo(settings.cwd);

		// Copy, don't symlink
		duo.copy(true);

		// Set the build dir
		duo.buildTo('./assets/js');

		// If there is a token, use it
		if (!!settings.config.duoToken) {
			duo.token(settings.config.duoToken);
		}

		/*
		"duo": {
			"libs": ["jquery-1.11.1", "lodash", "fastclick"],
			"libs/dev": ["console-shim"],
			"ie/head": ["html5shiv"],
			"ie/body": ["ie-behavior-span", "respond"]
		}
		*/

		deps.lodash.forIn(settings.config.duo, function (section, sectionKey) {
			// Set the download dir
			duo.installTo('./duo-components/' + section);

			// Fetch individual components
			deps.lodash.each(section, function (module, moduleKey) {
				//console.log('duo: including %s', module);
				duo.include(module).run(function (err, src) {
					if (err) console.log('err', err);

					console.log('src', src);
				});;
			});
		});

		cb(null);
	});
});
