'use strict';

// Require modules

var
    deps            = require('../lib/dependencies'),
    settings        = require('./settings')
;

// Define variables

var
    _               = deps.lodash,
    c               = deps.chalk,
    structure       = [
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
            command: 'build',
            description: 'Build a project',
            flags: [{
                flag: '--s, --serve',
                description: 'Serve the files on a static address'
            }, {
                flag: '--p, --production',
                description: 'Optimize files for production'
            }, {
                flag: '--c, --compat [v|all]',
                description: 'Include patches for IE (default "all")'
            }, {
                flag: '--o, --open',
                description: 'Open project in a browser'
            }, {
                flag: '--e, --edit',
                description: 'Open project in an editor'
            }, {
                flag: '--t, --tunnel',
                description: 'Tunnel your served files to the web (requires --serve)'
            }, {
                flag: '--r, --ruby',
                description: 'Use the Ruby Sass compiler (requires Ruby and the Sass gem)'
            }]
        }, {
            command: 'config',
            description: 'Configure global defaults'
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
    indentCharacter = '   ',
    longestFlag     = 0,
    spinner,
    spinnerTimer
;

// Helper functions

function strPadTo (str, len) {
    while (str.length < len) {
        str = str + ' ';
    }
    return str;
}

// Find the longest flag
//
// Lodash chain rom the inside out:
// - grab al "flags" values
// - flatten them recursively
// - remove all falsy values (compact)
// - grab all "flag" values
// - find out which once is the longest

longestFlag = _.reduce(_.pluck(_.compact(_.flatten(_.pluck(structure, 'flags'), true)), 'flag'), function (max, flag) {
    return flag.length > max.length ? flag : max;
}).length + indentCharacter.length;

// Set spinner

deps.cliSpinner.Spinner.setDefaultSpinnerString(9);

// Set exports

exports = module.exports = {

    // Log the ASCII header

    logHeader: function (pkg) {
        console.log(
            '\n' + c.grey('___') + c.cyan('/\\/\\') + c.grey('____') + c.cyan('/\\/\\') + c.grey('____') + c.cyan('/\\/\\/\\/\\/\\') + c.grey('___') + '\n' +
            c.grey('___') + c.cyan('/\\/\\') + c.grey('____') + c.cyan('/\\/\\') + c.grey('__') + c.cyan('/\\/\\') + c.grey('___________') + '\n' +
            c.grey('___') + c.cyan('/\\/\\/\\/\\/\\/\\') + c.grey('____') + c.cyan('/\\/\\/\\/\\') + c.grey('_____') + '\n' +
            c.grey('___') + c.cyan('/\\/\\') + c.grey('____') + c.cyan('/\\/\\') + c.grey('__________') + c.cyan('/\\/\\') + c.grey('___') + '\n' +
            c.grey('___') + c.cyan('/\\/\\') + c.grey('____') + c.cyan('/\\/\\') + c.grey('__') + c.cyan('/\\/\\/\\/\\/\\') + c.grey('_____') + '\n\n' + c.cyan.inverse(' ➳  http://headstart.io ') + c.yellow.inverse(' v' + pkg.version + ' ') + '\n'
        );
    },

    // Logs the CLI options

    logTasks: function () {
        console.log(
            'Usage: ' + c.cyan('headstart <command> [<flag> ...]') + '\n' +
            'Shorthand: ' + c.cyan('hs <command> [<flag> ...]') + '\n'
        );

        _.each(structure, function (cmd, cmdKey, cmdList) {
            if (cmd.sectionTitle) {
                console.log(c.underline(cmd.sectionTitle) + '\n');
            } else if (cmd.command) {
                console.log(strPadTo(cmd.command, longestFlag) + indentCharacter + cmd.description + (!cmd.flags ? '\n' : ''));
            }

            _.each(cmd.flags, function (flag, flagKey, flagList) {
                flag.flag = (cmd.command ? indentCharacter : '') + flag.flag;

                console.log(strPadTo(flag.flag, longestFlag) + indentCharacter + flag.description + (flagKey === flagList.length-1 ? '\n' : ''));
            });
        });
    },

    // // Patch module output
    //
    // patchOutput: function () {
    //     require('./hook.js')(process.stdout).hook('write', function (msg, encoding, fd, write) {
    //
    //         // Validate message
    //         msg = exports.validateOutput(msg);
    //
    //         // If the message is not suited for output, block it
    //         if (!msg) {
    //             return;
    //         }
    //
    //         // If the message is one character long (eg. "\n"), block it
    //         if (msg.length === 1) {
    //             return;
    //         }
    //
    //         // The build is not complete yet, so buffer
    //         /*if (!settings.buildComplete) {
    //             settings.stdoutBuffer.push(msg);
    //             return;
    //         }*/
    //
    //         // There is a buffer
    //         if(settings.stdoutBuffer.length) {
    //             // Prepend a newline to the array
    //             settings.stdoutBuffer.unshift('\n');
    //
    //             // Write out the buffer untill its empty
    //             while (settings.stdoutBuffer.length) {
    //                 write(settings.stdoutBuffer.shift());
    //             }
    //         }
    //
    //         // Finally, just write out
    //         write(msg);
    //     });
    // },
    //
    // // Validate (and modify) passed in output messages
    //
    // validateOutput: function (msg) {
    //     var cleanMsg = c.stripColor(msg);
    //
    //     // Detect gulp-util "[XX:XX:XX] ..." logs,
    //     if (/^\[[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}\]/.test(cleanMsg)) {
    //         var allowFlag = false;
    //
    //         // Allow gulp-ruby-sass errors,
    //         // but format them a bit
    //         if (cleanMsg.indexOf('was changed') > -1) {
    //             msg = cleanMsg.split(' ');
    //             msg.shift();
    //             msg[0] = msg[0].split('/').pop();
    //             msg = msg.join(' ').trim();
    //             msg = c.grey(msg) + '\n';
    //
    //             allowFlag = true;
    //         }
    //
    //         // Allow gulp-sass errors,
    //         // but format them a bit
    //         if (cleanMsg.indexOf('gulp-sass') > -1) {
    //             msg = cleanMsg.split('[gulp-sass]').pop().trim();
    //             msg = c.red.inverse('SASS ERROR') + ' ' + msg + '\n';
    //
    //             allowFlag = true;
    //         }
    //
    //         // Allow gulp-plumber errors,
    //         // but format them a bit
    //         if (!allowFlag && cleanMsg.indexOf('Plumber found') > - 1) {
    //             msg = cleanMsg.split('Plumber found unhandled error:').pop().trim();
    //             msg = c.red.inverse('ERROR') + ' ' + msg + '\n';
    //
    //             allowFlag = true;
    //         }
    //
    //         // Grab the result of gulp-imagemin
    //         if (!allowFlag && cleanMsg.indexOf('gulp-imagemin: Minified') > -1) {
    //             msg = cleanMsg.split('gulp-imagemin:').pop().trim();
    //             msg = c.green('✄  ' + msg) + '\n';
    //
    //             allowFlag = true;
    //         }
    //
    //         // Allow W3C validation errors,
    //         // but format them a bit
    //         if (!allowFlag && cleanMsg.indexOf('HTML Error:') > -1) {
    //             msg = cleanMsg.split('HTML Error:').pop().trim();
    //             msg = c.red.inverse('HTML ERROR') + ' ' + msg + '\n';
    //
    //             allowFlag = true;
    //         }
    //
    //         // Grab the result of CSSMin
    //         if (!allowFlag && cleanMsg.indexOf('.css is now') > -1) {
    //             msg = cleanMsg.split(' ').slice(1).join(' ').trim();
    //             msg = c.green('✄  ' + msg) + '\n';
    //
    //             allowFlag = true;
    //         }
    //
    //         // Block all the others
    //         if (!allowFlag) {
    //             return false;
    //         }
    //     }
    //
    //     // Block sass-graph errors
    //     /*var graphMatches = _.filter(['failed to resolve', 'failed to add'], function (part) {
    //         return cleanMsg.indexOf(part) > -1;
    //     });*/
    //     if (/^failed to resolve|failed to add/.test(msg)) {
    //         return false;
    //     }
    //
    //     return msg;
    // },

    // Show a spinner while a task runs

    toggleTaskSpinner: function (task) {
        // Don't show spinners when serving
        if (settings.lrStarted) {
            return;
        }

        if (!!spinner) {
            if (task === false || task && spinner.text.indexOf(task) < 0 ) {
                spinner.stop(true);
                console.log(c.grey('✔  ' + spinner.text + ' (' + deps.prettyhr(process.hrtime(spinnerTimer)) + ')'));
            }

            if (task === false) {
                spinner = null;
                return;
            }
        }

        spinner = new deps.cliSpinner.Spinner(task);
        spinner.start();
        spinnerTimer = process.hrtime();
    },

    structure: structure,
    tasks: _.compact(_.flatten(_.pluck(structure, 'command')))
};
