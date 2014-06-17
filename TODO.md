### TODO's:

  - [ ] Fix crashes with added/deleted folders and new/deleted files
  - [ ] Fix logging by gulp-connect (Pull-req, fork & fix, or muting https://www.npmjs.org/package/mute-stream)

### A list of things to explore:

  - [ ] Replace serving and livereloading with browser-sync (https://github.com/shakyShane/browser-sync through http://shakyshane.com/gulpjs-sass-browsersync-ftw/)
  - [ ] Think about fixed size columns for eg ads
  - [ ] Try to have revisioned images, even though updating references in other files will be hard (https://github.com/smysnk/gulp-rev-all)
  - [ ] Auto-check for updates (http://stackoverflow.com/questions/20686244/install-programmatically-a-npm-package-providing-its-version and http://stackoverflow.com/questions/11949419/nodejs-npm-show-latest-version-of-a-module)
  - [ ] Set a watch for folder like fonts/video
  - [ ] Watch changes on config, and rebuild
  - [ ] Make favicon generating optional (https://www.npmjs.org/package/favicon-generator/)
  - [ ] See if Commander is a better alternative to LiftOff (https://github.com/visionmedia/commander.js)
  - [ ] See if replacing all minifying modules with gulp-compressor makes things faster (https://www.npmjs.org/package/gulp-compressor/)
  - [ ] Try replacing gulp-inject with gulp-include-source (https://www.npmjs.org/package/gulp-include-source/)
  - [ ] Automatically solve crashes with gulp-nodemon (https://www.npmjs.org/package/gulp-nodemon/) or keepup (https://www.npmjs.org/package/keepup/)

  ### Done

  - [x] Fix reloading when a layout/partial changes
  - [x] Find a better/smarter templating system https://www.npmjs.org/package/gulp-file-insert/
  - [x] Find better (smaller, dep-less) way of stripping comments from --production HTML
  - [x] Allow custom repo's to be set for scaffolding
  - [x] Fix sass and htmlmin error crashes
  - [x] Add W3C validation option to config (https://www.npmjs.org/package/gulp-w3cjs/)
  - [x] Try out revisions to leverage cache control (https://github.com/sindresorhus/gulp-rev)
  - [x] Generate a cache manifeset for --production (https://www.npmjs.org/package/gulp-manifest/ + http://diveintohtml5.info/offline.html)
