### A list of things to explore:

  - Make sure regular css files can be used as well
  - Re-write docs
  - Think about upgrading (eg. user settings that stay local, app files)
  - Saving/adding _ prefixed scss files should recompile the main scss files (I'm guessing ruby-sass blocks these to "follow" with the compass guidelines).
  - See if merging media queries reduces the size of css files (https://www.npmjs.org/package/gulp-combine-media-queries)
  - Try implementing uncss

### Real TODO's:

  - Fix the button scss module
  - Multiple css selectors should each be put on their own line
  - plumber the stream after sass and autoprefix to prevent crashing of the gulp process (see "lite" > website branch)
  - Google Chrome audits don't seem to use the gzipping from the .htaccess. Maybe files need to be gzipped themselves (there's a plugin for that!)?