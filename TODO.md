### TODO's:

  - [ ] Fix crashes with added/deleted folders and new/deleted files
  - [ ] Fix logging by gulp-connect (Pull-req, fork & fix, or muting https://www.npmjs.org/package/mute-stream)

### A list of things to explore:

  - [ ] Replace livereloading with browser-sync (https://github.com/shakyShane/browser-sync through http://shakyshane.com/gulpjs-sass-browsersync-ftw/)
  - [ ] Think about fixed size columns for eg ads
  - [ ] Generate a cache manifeset for --production (https://www.npmjs.org/package/gulp-manifest/ + http://diveintohtml5.info/offline.html)
  - [ ] Add W3C validation option to config (https://www.npmjs.org/package/gulp-w3cjs/)
  - [ ] Try out revisions to leverage cache control (https://github.com/smysnk/gulp-rev-all, htaccess!!)
  - [ ] Auto-check for updates (http://stackoverflow.com/questions/20686244/install-programmatically-a-npm-package-providing-its-version and http://stackoverflow.com/questions/11949419/nodejs-npm-show-latest-version-of-a-module)
  - [ ] Set a watch for folder like fonts/video
  - [ ] Watch changes on config, and rebuild

  ### Done

  - [x] Fix reloading when a layout/partial changes
  - [x] Find a better/smarter templating system https://www.npmjs.org/package/gulp-file-insert/
  - [x] Find better (smaller, dep-less) way of stripping comments from --production HTML
  - [x] Allow custom repo's to be set for scaffolding
  - [x] Fix sass and htmlmin error crashes
