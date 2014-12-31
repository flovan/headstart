'use strict';

// Require modules

var
    chalk               = require('chalk'),
    _                   = require('lodash')
;

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
            'Usage: ' +
            chalk.cyan('headstart <command> [<flag> ...]') +
            '\n' +
            'Shorthand: ' +
            chalk.cyan('hs <command> [<flag> ...]') +
            '\n\n' +
            chalk.underline('Possible <command> and <flag> combinations:') +
            '\n\n' +
            'init' +
            chalk.grey('\t\t\tStart a new project') +
            '\n' +
            '   --base <source>' +
            chalk.grey('\tUse a custom boilerplate repo, eg. user/repo#branch') +
            '\n\n' +
            'build' +
            chalk.grey('\t\t\tBuild a project') +
            '\n' +
            '   --s, --serve' +
            chalk.grey('\t\tServe the files on a static address') +
            '\n' +
            '   --o, --open' +
            chalk.grey('\t\tOpen up a browser for you (default Google Chrome)') +
            '\n' +
            '   --e, --edit' +
            chalk.grey('\t\tOpen the files in your editor (default Sublime Text)') +
            '\n' +
            '   --p, --production' +
            chalk.grey('\tMake a production ready build') +
            '\n' +
            '   --t, --tunnel' +
            chalk.grey('\tTunnel your served files to the web (requires --serve)') +
            '\n' +
            '   --psi' +
            chalk.grey('\t\tRun PageSpeed Insights (requires --serve and --tunnel)') +
            '\n' +
            '   --strategy <type>' +
            chalk.grey('\tRun PSI in either "desktop" (default) or "mobile" mode') +
            '\n' +
            '   --rs, --rubySass' +
            chalk.grey('\tUse the Ruby Sass compiler (requires Sass gem)') +
            '\n\n' +
            chalk.underline('Common flags:') +
            '\n\n' +
            '--verbose' +
            chalk.grey('\t\tLog additional (module specific) information') +
            '\n' +
            '--i, --info,\n--h, --help' +
            chalk.grey('\t\tPrint out this message') +
            '\n' +
            '--v, --version' +
            chalk.grey('\t\tPrint out version') +
            '\n'
        );
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
    }
};