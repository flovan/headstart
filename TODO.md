### A list of things to explore:

  - Make sure regular css files can be used as well
  - Re-write docs
  - Think about upgrading (eg. user settings that stay local, app files)
  - Saving/adding _ prefixed scss files should recompile the main scss files (I'm guessing ruby-sass blocks these to "follow" with the compass guidelines).
  - See if merging media queries reduces the size of css files (https://www.npmjs.org/package/gulp-combine-media-queries)
  - Try implementing uncss (https://www.npmjs.org/package/gulp-uncss)
  - Make changelog with Git commit messages (https://github.com/michael-lynch/reading-time/commits/)
  - Follow progress of gulp-sass and implement when @extend functionality stabilizes (https://github.com/andrew/node-sass)
  - Replace livereloading with browser-sync (https://github.com/shakyShane/browser-sync through http://shakyshane.com/gulpjs-sass-browsersync-ftw/)

### Real TODO's:

  - Multiple css selectors should each be put on their own line
  - Google Chrome audits don't seem to use the gzipping from the .htaccess. Maybe files need to be gzipped themselves (there's a plugin for that!)?
  - Lazy load header image to improve initial load time (http://bttrlazyloading.julienrenaux.fr/demo/different-sizes.php OR https://github.com/shprink/bttrlazyloading/ OR something else :)
  - git tag the repo's (http://git-scm.com/book/en/Git-Basics-Tagging)
  - Link MIT license in footer after merging wip with master branch
  - When having multiple HTML pages, each one is rendered again when only one of them changes.
  - Certain ruby-sass (and maybe even autoprefixer) errors make the watches block. The system doesn't crash, but reloading stops working and tasks don't run.
  - Convert modules to use rem's
  - Remove wrong declaration at line 80, reporting
  - Resync with HTML5 boilerplate as there are some new additions
  - Re-add stripping of comments in HTML. Conditional comments were dumped, so this can be default.
  - _text.scss, change paragraph reset to :last-of-type:last-child
  - Add following link in HTML in iOS web app part: https://gist.github.com/tfausak/2222823
  - Move _state.scss to modules as it actually generates css styles.
  - Change the url to imported libraries in the global conf file to ../[...] as that is where libraries should be added