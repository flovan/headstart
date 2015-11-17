### TODO's:

  - [ ] Watch "other" and "root" files
  - [ ] Use https://www.npmjs.com/package/gulp-shell to make calls to headstart-old

### A list of things to explore:

  - [ ] Look into patternlab.io way of managing text/content through JSON (eg automatic HTML parsing to find variables and putting them into a JSON file)
  - [ ] Try to have revisioned images, even though updating references in other files will be hard (https://github.com/smysnk/gulp-rev-all, maybe https://www.npmjs.org/package/gulp-hash/ + https://www.npmjs.org/package/gulp-hash-references/)
  - [ ] Rebuild/Reserve on crash (https://github.com/leny/gulp-supervisor & https://github.com/JacksonGariety/gulp-nodemon & https://www.npmjs.org/package/keepup/)
  - [ ] Try having critical css inlined (http://css-tricks.com/authoring-critical-fold-css/ & https://github.com/pocketjoso/penthouse/#as-a-node-module OR https://github.com/filamentgroup/criticalcss)
  - [ ] Add Hound files (https://houndci.com/configuration)
  - [ ] Is `--verbose` necessairy?
  - [ ] More checks in add/change events to prevent unneeded reload (eg change _*.js)
  - [ ] Browsersync plugins? (eg https://www.npmjs.com/package/bs-html-injector, )

### Take a look at these plugins/libs also

  - https://github.com/jakecleary/elf-scss
  - [ ] Add more dev scripts (eg https://github.com/derekshull/nines)

### Done

  - [x] Fix reloading when a layout/partial changes
  - [x] Find a better/smarter templating system https://www.npmjs.org/package/gulp-file-insert/
  - [x] Find better (smaller, dep-less) way of stripping comments from --production HTML
  - [x] Allow custom repo's to be set for scaffolding
  - [x] Fix sass and htmlmin error crashes
  - [x] Add W3C validation option to config (https://www.npmjs.org/package/gulp-w3cjs/)
  - [x] Try out revisions to leverage cache control (https://github.com/sindresorhus/gulp-rev)
  - [x] Generate a cache manifeset for --production (https://www.npmjs.org/package/gulp-manifest/ + http://diveintohtml5.info/offline.html)
  - [x] Replace livereloading with browser-sync (https://github.com/shakyShane/browser-sync through http://shakyshane.com/gulpjs-sass-browsersync-ftw/)
  - [x] ^ Fix logging by gulp-connect (~~muting https://www.npmjs.org/package/mute-stream~~)
  - [x] Auto-check for updates (~~http://stackoverflow.com/questions/20686244/install-programmatically-a-npm-package-providing-its-version and http://stackoverflow.com/questions/11949419/nodejs-npm-show-latest-version-of-a-module~~ https://github.com/yeoman/update-notifier)
  - [x] Make box-sizing work through inherit (http://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice)
  - [x] Find a less crude way of muting module output through gulp-util
  - [x] Put Liftoff logo on website (https://www.npmjs.org/package/liftoff)
  - [x] Make HTML minifier options configurable through `config.json`
  - [x] Properly test gulp-combine-media-queries (Result: saves a few KB's, enabling by default in boilerplate v1.1.1)
  - [ ] ~~Use a different minifier (https://www.npmjs.org/package/gulp-compressor/ or https://www.npmjs.org/package/gulp-minifier/)~~
  - [ ] ~~Check out csscss (https://www.npmjs.org/package/gulp-csscss/)~~
  - [x] Properly test Uncss
  - [x] Pass gulp-ruby-sass errors instead of uncss notification
  - [x] Remove ender and underscore map from underscore.js
  - [x] Turn aliasing into state, and extend to doc/button/form module
  - [x] Fix url in update notice
  - [x] Fix jshint logs appearing in the middle of the progressbar
  - [x] Dry out modules
  - [x] Drop `open` in favour of opening the browser through `browsersync`
  - [x] A build starting with a Sass error will result in pages without (a) css file(s)
  - [x] Disable (and warn about disabling of) w3c validation when not ".html"
  - [x] Re-add `open` because openEditor won't work otherwise..
  - [x] ~~See if Commander is a better alternative to LiftOff (https://github.com/visionmedia/commander.js)~~ Nope
  - [x] https://www.npmjs.org/package/del/ instead of gulp-rimraf (will prolly have to use https://www.npmjs.org/package/gulp-filenames)
  - ~~[ ] Think about fixed size columns for eg ads~
  - [x] Split up gulpfile into task files (https://github.com/whitneyit/gulp-taskify or https://www.npmjs.org/package/gulp-hub/)
  - [x] Simpler watch setup > https://gist.github.com/Snugug/2dc9ff47ce4b4acb28f6
  - [ ] ~Add Quail as a dev lib (http://quailjs.org)~~
  - [ ] ~~Find out how to check for dependencies (such as Ender, see above, or maybe imagemagick (http://stackoverflow.com/questions/11703973/imagemagick-with-nodejs-not-working))~~
  - [x] Add a sass module that generates ready-to-use class-names (eg columns)
  - ~~[] Generate a .headstartrc file with defaults or customize~
  - ~~[ ] Replace Handlebars with [doT](https://github.com/olado/doT) (fast, but no layouting) or [nunjucks](https://github.com/mozilla/nunjucks) (huge API)~~
  - ~~[ ] Try replacing gulp-inject with gulp-include-source (https://www.npmjs.org/package/gulp-include-source/)~~
  - ~~[ ] Make it possible to use LESS (https://www.npmjs.org/package/gulp-less/)~~
  - ~~[ ] Make it possible to use Stylus (https://www.npmjs.org/package/gulp-stylus/)~~
  - ~~[ ] Maybe replace some CSS processing modules with gulp-pleeease (https://www.npmjs.org/package/gulp-pleeease/)~~
  - ~~[ ] Replace Ender by Cash when it gets out of alpha (https://github.com/kenwheeler/cash)~~
  - ~~[ ] Implement gulp-foreach (https://www.npmjs.org/package/gulp-foreach/)~~
  - ~~[ ] Make sure a key can be used with PSI (without any uncaught TypeError)~~
  - ~~[ ] CLI option to generate Ender builds~~
  - ~~[ ] `.headstartrc` file should have a 'dest' key in the favicons part to override exporting to root (export:root)~~
  - [x] Always combine media queries and dry out CSS
  - ~~[ ] Fix crash when missing `// requires` file is found~~
  - ~~[ ] Use SassDoc (https://github.com/SassDoc/gulp-sassdoc)~~
  - ~~[ ] Adding new view js files doesn't seem to add them to gaze~~
  - [x] Remove deleted / renamed files from export folder with ~~gulp-sync-files (https://www.npmjs.org/package/gulp-sync-files/)~~ custom script
  - ~~[ ] Use RealFaviconGenerator module to generate favicons / touch icons etc (https://github.com/RealFaviconGenerator/real-favicon/blob/master/index.js)~
  - ~~[ ] Add HTML Inspector as a dev dependency (http://www.sitepoint.com/write-better-markup-html-inspector + https://github.com/philipwalton/html-inspector)~~
  - [x] Watch changes on config and folders like fonts/video
  - [x] Add "perf" command for performance checks
  - ~~[ ] See if scripts tasks can be made faster with gulp-remember (https://github.com/ahaurw01/gulp-remember)~~
