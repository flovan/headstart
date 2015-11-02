'use strict';

var
	deps     = require('../dependencies'),
	utils    = require('../utils'),
	cli      = require('../cli'),
	settings = require('../settings'),

	c        = deps.chalk,
	_        = deps.lodash
;

// Load and parse the configuration file
function loadConfig (cb) {
	console.log(c.gray('Loading project configuration'));

	// Try to read the .headstartrc file
	deps.fs.readFile('.headstartrc', 'utf8', function (err, data) {
		// If none is found, check if this is an older project before quiting
		if (err) {
			deps.fs.readFile('config.json', 'utf8', function (err, data) {
				if (err) {
					console.log(c.red('✘  Cannot find .headstartrc. `build` cancelled.'));
				} else {
					console.log(c.red('✘  This seems to be an older Headstart project. Please run `(sudo) npm install --g headstart-prev` and build again with `headstart-prev build [flags]`.'));
				}

				process.exit(1);
			});
		}

		// Try parsing the config data as JSON
		try {
			data = JSON.parse(data);
		} catch (err) {
			console.log(c.red('✘  The configuration file is not valid json. `build` cancelled.'), err);
			process.exit(1);
		}

		// Merge loaded config with process defaults
		_.defaults(data || {}, settings.config);/*, function (a, b) {
			var aType = typeof a,
				bType = typeof b;

			// But not if the type doesn't match
			if (aType !== bType) {
				return false;
			}

			// Nor if we're expecting an array but not getting one
			if (aType === 'object' && _.isArray(a) && !_.isArray(b)) {
				return false;
			}

			return true;
		});*/

		cb();
	})
}

// Define task
deps.taker.task('build', function (cb) {
	var start = process.hrtime();

	// Add an emtpy line in the shell
	console.log('');

	// Load the config.json file
	loadConfig(function () {
		// Run build tasks
		deps.taker.series(
			'clean-export',
			'sass',
			'scripts',
			'graphics',
			'other',
			'root',
			'templates',
			function () {
				console.log(c.green(`Build complete (${deps.prettyhr(process.hrtime(start))})`));
				cb();
			}
		)();
	});
});