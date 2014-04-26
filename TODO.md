### A list of things to explore:

  - Make sure regular css files can be used as well
  - Replace livereloading with browser-sync (https://github.com/shakyShane/browser-sync through http://shakyshane.com/gulpjs-sass-browsersync-ftw/)
  - Think about fixed size columns for eg ads
  - git tag the repo's (http://git-scm.com/book/en/Git-Basics-Tagging)

### Workflow TODO's:

  - When having multiple HTML pages, each one is rendered again when only one of them changes.
  - Fix image optimization (https://www.npmjs.org/package/gulp-imagemin)
  - Convert $(document).on('ready') to .ready()
  - Check if process still crashed with added/deleted folders
  - Extract boilerplate files into different repo and scaffold them from there
  - Allow custom repo's to be set for scaffolding
  - Add W3C validation option to config (https://www.npmjs.org/package/gulp-w3cjs/)
  - See if gulp-sass-graph and gulp-changed can be replaced by gulp-newer (https://www.npmjs.org/package/gulp-changed/)
  - Find better (smaller, dep-less) way of stripping comments from --production HTML
  - When --serve without --open, copy url to clipboard (https://www.npmjs.org/package/gulp-clipboard/)
  - Try implementing deporder for non-hardcoded js dependency management (https://www.npmjs.org/package/gulp-deporder/)
  - Try using gulp-linker instead of the complicated tap/inject setup (https://www.npmjs.org/package/gulp-linker/)
  - Generate a cache manifeset for --production (https://www.npmjs.org/package/gulp-manifest/ + http://diveintohtml5.info/offline.html)

### Website TODO's

  - Lazy load header image to improve initial load time (http://bttrlazyloading.julienrenaux.fr/demo/different-sizes.php OR https://github.com/shprink/bttrlazyloading/ OR something else :)
