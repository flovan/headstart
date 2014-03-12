### A list of things to explore:

  - Make sure regular css files can be used as well
  - Think about upgrading (eg. user settings that stay local, app files)
  - Saving/adding _ prefixed scss files should recompile the main scss files (I'm guessing ruby-sass blocks these to "follow" with the compass guidelines).
  - See if merging media queries reduces the size of css files (https://www.npmjs.org/package/gulp-combine-media-queries)
  - Try implementing uncss (https://www.npmjs.org/package/gulp-uncss)
  - Make changelog with Git commit messages (https://github.com/michael-lynch/reading-time/commits/)
  - Follow progress of gulp-sass and implement when @extend functionality stabilizes (https://github.com/andrew/node-sass)
  - Replace livereloading with browser-sync (https://github.com/shakyShane/browser-sync through http://shakyshane.com/gulpjs-sass-browsersync-ftw/)

### Real TODO's:

  - Google Chrome audits don't seem to use the gzipping from the .htaccess. Maybe files need to be gzipped themselves (there's a plugin for that!)?
  - When having multiple HTML pages, each one is rendered again when only one of them changes.
  - Certain ruby-sass (and maybe even autoprefixer) errors make the watches block. The system doesn't crash, but reloading stops working and tasks don't run.
  - Add IE fixes in lite version
  - Think about fixed size columns for eg ads
  - Include ie specific js file, expand task by importing all other files at the end

### Website TODO's

  - Lazy load header image to improve initial load time (http://bttrlazyloading.julienrenaux.fr/demo/different-sizes.php OR https://github.com/shprink/bttrlazyloading/ OR something else :)
  - git tag the repo's (http://git-scm.com/book/en/Git-Basics-Tagging)
  - Link MIT license in footer after merging wip with master branch