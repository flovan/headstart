'use strict';

// Require modules

var
	deps                = require('../dependencies'),
	cli                 = require('../cli'),
	settings            = require('../settings'),

	c = deps.chalk,
	_ = _
;

// Load and parse the configuration file
function loadConfig (cb) {
	console.log(' ');
	cli.toggleTaskSpinner('Loading project configuration');

	// Try to read the .headstartrc file
	deps.fs.readFile('.headstartrc', 'utf8', function (err, data) {
		cli.toggleTaskSpinner(false);

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
		_.assign(settings.config, data, function (a, b) {
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
		});

		cb();
	})
}

// Define task
console.log('should build');
deps.taker.task('build', function (cb) {
	var start = process.hrtime(); 	

	// Load the config.json file
	loadConfig(function () {
		// Run build tasks
		deps.taker.series(
			'clean-export',
			//'styles',
			//'scripts',
			// 'images',
			// 'favicons',
			// 'other',
			// 'templates',
			// 'manifest',
			function () {
				cli.toggleTaskSpinner(false);
				console.log('\n' + c.green('✔  Build complete (' + deps.prettyhr(process.hrtime(start)) + ')\n'));

				// Serve files if Headstart was run with the --serve flag
				// if(settings.isServe) {
				// 	deps.taker.series('server')();
				// }

				cb();
			}
		)();
	});
});