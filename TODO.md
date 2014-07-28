### TODO's:

  /

### A list of things to explore:

  - [ ] Think about fixed size columns for eg ads
  - [ ] Try to have revisioned images, even though updating references in other files will be hard (https://github.com/smysnk/gulp-rev-all)
  - [ ] Watch changes on config and folders like fonts/video, and rebuild (https://github.com/leny/gulp-supervisor & https://github.com/JacksonGariety/gulp-nodemon & https://www.npmjs.org/package/keepup/)
  - [ ] Make favicon generating optional (https://www.npmjs.org/package/favicons)
  - [ ] See if Commander is a better alternative to LiftOff (https://github.com/visionmedia/commander.js)
  - [ ] See if replacing all minifying modules with gulp-compressor makes things faster (https://www.npmjs.org/package/gulp-compressor/)
  - [ ] Try replacing gulp-inject with gulp-include-source (https://www.npmjs.org/package/gulp-include-source/)
  - [ ] See if scripts tasks can be made faster with gulp-remember (https://github.com/ahaurw01/gulp-remember)
  - [ ] Maybe do something with icon fonts from SVG files (https://www.npmjs.org/package/gulp-fontcustom/ or https://github.com/nfroidure/gulp-iconfont or https://github.com/nfroidure/gulp-svgicons2svgfont)
  - [ ] Make it possible to use LESS (https://www.npmjs.org/package/gulp-less/)
  - [ ] Make it possible to use Stylus (https://www.npmjs.org/package/gulp-stylus/)
  - [ ] Maybe replace some CSS processing modules with gulp-pleeease (https://www.npmjs.org/package/gulp-pleeease/)
  - [ ] Make sure a key can be used with PSI (without any uncaught TypeError)
  - [ ] Try having critical css inlined (http://css-tricks.com/authoring-critical-fold-css/ & https://github.com/pocketjoso/penthouse/#as-a-node-module OR https://github.com/filamentgroup/criticalcss)
  - [ ] Use SassDoc (https://github.com/SassDoc/gulp-sassdoc)
  - [ ] Make box-sizing work through inherit (http://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice)
  - [ ] Split up gulpfile into task files (https://github.com/whitneyit/gulp-taskify)

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
