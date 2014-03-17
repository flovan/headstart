### A list of things to explore:

  - Make sure regular css files can be used as well
  - Think about upgrading (eg. user settings that stay local, app files)-
  - Replace livereloading with browser-sync (https://github.com/shakyShane/browser-sync through http://shakyshane.com/gulpjs-sass-browsersync-ftw/)
  - Think about fixed size columns for eg ads
  - Look at Deporder again to improve script deps (https://www.npmjs.org/package/gulp-deporder/)

### Common TODO's:

  - Google Chrome audits don't seem to use the gzipping from the .htaccess. Maybe files need to be gzipped themselves (there's a plugin for that!)?
  - When having multiple HTML pages, each one is rendered again when only one of them changes.
  - Implement W3C validator (https://www.npmjs.org/package/gulp-w3cjs/)
  - Implement app manifest generator (https://www.npmjs.org/package/gulp-manifest/ + http://diveintohtml5.info/offline.html)
  - Put in "silent file" feature with "_afile.js" syntax
  - Replace "cancellable" with options

### Main TODO's:

  - /

### Lite TODO's:

  - Try implementing uncss (https://www.npmjs.org/package/gulp-uncss)
  - Convert $(document).on('ready') to .ready()
  - Remove js/core files

### Website TODO's

  - Lazy load header image to improve initial load time (http://bttrlazyloading.julienrenaux.fr/demo/different-sizes.php OR https://github.com/shprink/bttrlazyloading/ OR something else :)
  - git tag the repo's (http://git-scm.com/book/en/Git-Basics-Tagging)
  - Link MIT license in footer after merging wip with master branch
  - Make changelog with Git commit messages (https://github.com/michael-lynch/reading-time/commits/)