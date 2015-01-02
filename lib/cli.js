'use strict';

// Require modules

var
    chalk               = require('chalk'),
    _                   = require('lodash'),
    Spinner             = require('./spinner').Spinner,
    settings            = require('./settings')
;

// Define variables

var
    structure           = [
        {
            sectionTitle: 'Possible <command> and <flag> combinations:'
        }, {
            command: 'new',
            description: 'Start a new project',
            flags: [{
                flag: '--base <source>',
                description: 'Use a custom boilerplate repo, eg. user/repo#branch'
            }]
        }, {
            command: 'init',
            description: 'Install dependencies'
        }, {
            command: 'build',
            description: 'Build a project',
            flags: [{
                flag: '--s, --serve',
                description: 'Serve the files on a static address'
            }, {
                flag: '--o, --open',
                description: 'Open project in a browser'
            }, {
                flag: '--e, --edit',
                description: 'Open project in an editor'
            }, {
                flag: '--p, --production',
                description: 'Optimize files for production'
            }, {
                flag: '--t, --tunnel',
                description: 'Tunnel your served files to the web (requires --serve)'
            }, {
                flag: '--psi',
                description: 'Run PageSpeed Insights (requires --serve and --tunnel)'
            }, {
                flag: '--strategy <type>',
                description: 'Run PSI in either "desktop" (default) or "mobile" mode'
            }, {
                flag: '--rs, --rubySass',
                description: 'Use the Ruby Sass compiler (requires Ruby and the Sass gem)'
            }]
        }, {
            sectionTitle: 'Common flags:'
        }, {
            flags: [{
                flag: '--verbose',
                description: 'Log additional (module specific) information'
            }, {
                flag: '--i, --info, --h, --help',
                description: 'Print out this message'
            }, {
                flag: '--v, --version',
                description: 'Print out version'
            }]
        }
    ],
    indentCharacter     = '   ',
    longestFlag         = 0,
    spinner             = null
;

// Helper functions

function strPadTo (str, len) {
    while (str.length < len) {
        str = str + ' ';
    }
    return str;
}

// Find the longest flag

longestFlag = _.reduce(_.pluck(_.compact(_.flatten(structure, 'flags')), 'flag'), function (max, flag) {
    return flag.length > max.length ? flag : max;
}).length + indentCharacter.length;

// Set spinner

Spinner.setDefaultSpinnerString(9);

// Set exports

exports = module.exports = {

    // Log the ASCII header

    logHeader: function (pkg) {
        console.log(
            '\n' + chalk.grey('___') + chalk.cyan('/\\/\\') + chalk.grey('____') + chalk.cyan('/\\/\\') + chalk.grey('____') + chalk.cyan('/\\/\\/\\/\\/\\') + chalk.grey('___') + '\n' +
            chalk.grey('___') + chalk.cyan('/\\/\\') + chalk.grey('____') + chalk.cyan('/\\/\\') + chalk.grey('__') + chalk.cyan('/\\/\\') + chalk.grey('___________') + '\n' +
            chalk.grey('___') + chalk.cyan('/\\/\\/\\/\\/\\/\\') + chalk.grey('____') + chalk.cyan('/\\/\\/\\/\\') + chalk.grey('_____') + '\n' +
            chalk.grey('___') + chalk.cyan('/\\/\\') + chalk.grey('____') + chalk.cyan('/\\/\\') + chalk.grey('__________') + chalk.cyan('/\\/\\') + chalk.grey('___') + '\n' +
            chalk.grey('___') + chalk.cyan('/\\/\\') + chalk.grey('____') + chalk.cyan('/\\/\\') + chalk.grey('__') + chalk.cyan('/\\/\\/\\/\\/\\') + chalk.grey('_____') + '\n\n' + chalk.cyan.inverse(' ➳  http://headstart.io ') + chalk.yellow.inverse(' v' + pkg.version + ' ') + '\n'
        );
    },

    // Logs the CLI options

    logTasks: function () {
        console.log(
            'Usage: ' + chalk.cyan('headstart <command> [<flag> ...]') + '\n' +
            'Shorthand: ' + chalk.cyan('hs <command> [<flag> ...]') + '\n'
        );

        _.each(structure, function (cmd, cmdKey, cmdList) {
            if (cmd.sectionTitle) {
                console.log(chalk.underline(cmd.sectionTitle) + '\n');
            } else if (cmd.command) {
                console.log(strPadTo(cmd.command, longestFlag) + indentCharacter + chalk.grey(cmd.description) + (!cmd.flags ? '\n' : ''));
            }

            _.each(cmd.flags, function (flag, flagKey, flagList) {
                flag.flag = (cmd.command ? indentCharacter : '') + flag.flag;

                console.log(strPadTo(flag.flag, longestFlag) + indentCharacter + chalk.grey(flag.description) + (flagKey === flagList.length-1 ? '\n' : ''));
            });
        });
    },

    // Patch module output

    patchOutput: function () {
        require('./hook.js')(process.stdout).hook('write', function (msg, encoding, fd, write) {

            // Validate message
            msg = exports.validateOutput(msg);

            // If the message is not suited for output, block it
            if (!msg) {
                return;
            }

            // If the message is one character long (eg. "\n"), block it
            if (msg.length === 1) {
                return;
            }
            
            // The build is not complete yet, so buffer
            if (!settings.buildComplete) {
                settings.stdoutBuffer.push(msg);
                return;
            }

            // There is a buffer
            if(settings.stdoutBuffer.length) {
                // Prepend a newline to the array
                settings.stdoutBuffer.unshift('\n');

                // Write out the buffer untill its empty
                while (settings.stdoutBuffer.length) {
                    write(settings.stdoutBuffer.shift());
                }
            }

            // Finally, just write out
            write(msg);
        });
    },

    // Validate (and modify) passed in output messages

    validateOutput: function (msg) {
        var cleanMsg = chalk.stripColor(msg);

        // Detect gulp-util "[XX:XX:XX] ..." logs, 
        if (/^\[[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}\]/.test(cleanMsg)) {
            var allowFlag = false;

            // Allow gulp-ruby-sass errors,
            // but format them a bit
            if (cleanMsg.indexOf('was changed') > -1) {
                msg = cleanMsg.split(' ');
                msg.shift();
                msg[0] = msg[0].split('/').pop();
                msg = msg.join(' ').trim();
                msg = chalk.grey(msg) + '\n';

                allowFlag = true;
            }

            // Allow gulp-sass errors,
            // but format them a bit
            if (cleanMsg.indexOf('gulp-sass') > -1) {
                msg = cleanMsg.split('[gulp-sass]').pop().trim();
                msg = chalk.red.inverse('SASS ERROR') + ' ' + msg + '\n';

                allowFlag = true;
            }

            // Allow gulp-plumber errors,
            // but format them a bit
            if (!allowFlag && cleanMsg.indexOf('Plumber found') > - 1) {
                msg = cleanMsg.split('Plumber found unhandled error:').pop().trim();
                msg = chalk.red.inverse('ERROR') + ' ' + msg + '\n';

                allowFlag = true;
            }

            // Grab the result of gulp-imagemin
            if (!allowFlag && cleanMsg.indexOf('gulp-imagemin: Minified') > -1) {
                msg = cleanMsg.split('gulp-imagemin:').pop().trim();
                msg = chalk.green('✄  ' + msg) + '\n';

                allowFlag = true;
            }

            // Allow W3C validation errors,
            // but format them a bit
            if (!allowFlag && cleanMsg.indexOf('HTML Error:') > -1) {
                msg = cleanMsg.split('HTML Error:').pop().trim();
                msg = chalk.red.inverse('HTML ERROR') + ' ' + msg + '\n';

                allowFlag = true;
            }

            // Grab the result of CSSMin
            if (!allowFlag && cleanMsg.indexOf('.css is now') > -1) {
                msg = cleanMsg.split(' ').slice(1).join(' ').trim();
                msg = chalk.green('✄  ' + msg) + '\n';

                allowFlag = true;
            }

            // Block all the others
            if (!allowFlag) {
                return false;
            }
        }

        // Block sass-graph errors
        /*var graphMatches = _.filter(['failed to resolve', 'failed to add'], function (part) {
            return cleanMsg.indexOf(part) > -1;
        });*/
        if (/^failed to resolve|failed to add/.test(msg)) {
            return false;
        }

        return msg;
    },

    // Show a spinner while a task runs

    toggleTaskSpinner: function (task) {
        // Don't show spinners when serving
        if (settings.lrStarted) {
            return;
        }

        if (spinner !== null) {
            if (task === false || task && spinner.text.indexOf(task) < 0 ) {
                spinner.stop(true);
                console.log(chalk.grey('✔  ') + spinner.text);
            }

            if (task === false) {
                spinner = null;
                return;
            }
        }
        
        spinner = new Spinner(chalk.grey(task));
        spinner.start();
    },

    structure: structure,
    tasks: _.compact(_.flatten(structure, 'command'))
};