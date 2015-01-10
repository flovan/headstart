'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	utils               = require('../utils'),
	cli                 = require('../cli'),
	settings            = require('../settings')
;

// Define Gulp task

deps.gulp.task('init', function (cb) {
	utils.loadConfig(function () {
		// Check if there is a configuration for Duo
		if (!settings.config.duo) {
			console.log(deps.chalk.yellow('No Duo configuration found, continuing...'));
			utils.finishInit();

			cb(null);
		}

		deps.gulp.series('clean-duo', function () {
			cli.toggleTaskSpinner('Fetching JS dependencies (this might take a while)');

			var numSections = deps.lodash.size(settings.config.duo);

			deps.lodash.forIn(settings.config.duo, function (section, sectionKey) {
				// Fetch individual components
				var depContent = '';
				deps.lodash.each(section, function (module, moduleKey) {
					// Compose a "fake" file with `require()`s
					depContent += 'var ' + sectionKey.split('/').join('_') + moduleKey + '=require(\'' + module + '\');';
				});

				// Initiate, configure and run Duo
				var duo = new deps.Duo(settings.cwd);
				duo
					.copy(true)
					.token(settings.config.duoToken || false)
					.buildTo(settings.assetsFolder + '/' + settings.jsFolder + '/' + sectionKey)
					.installTo(settings.duoFolder + '/' + sectionKey)
					.entry(depContent, 'js')
					.run(function (err, src) {
						if (err) {
							console.log(deps.chalk.red.inverse('DUO ERROR') + ' ' + err);
							process.exit(0);
						}

						// Fetching done, now build
						duo.write(function (err, src) {
							if (err) {
								console.log(deps.chalk.red.inverse('DUO ERROR') + ' ' + err);
								process.exit(0);
							}

							// Manage the callback
							numSections--;
							if (numSections === 0) {
								cli.toggleTaskSpinner(false);
								cb(null);
							}
						});
					})
				;
			});
		})();
	});
});
