## Headstart changelog

## 1.3.2

- Reintroduced console output on file changes to show that things are working.
- Added an optional configuration setting that enables using a different name for the assets folder.

## 1.3.1

- Fixed a bug that prevented the browser from reloading when changes were made.

## 1.3.0

- Removed revisioning of non-default files such as fonts, videos, etc. because there is no automated way (yet) of updating references elsewhere.
- Switched tunneling to Localtunnel through Browsersync.
- A custom tunnel can now be set through the `--tunnel` flag.
- Added more optional configuration settings:
  - A proxy can now be set to enable live changes with a different host (think MAMP of XAMP).
  - A port can now be set if you already have something running on the default 3000.
  - The HTML minifier behaviour can now be finetuned to your preferences.
- Added a progress bar to the build process.
- Bugfixes

# 1.2.3

- Fix for missing view-specific JS files.

# 1.2.2

- Fix for missing module error.

# 1.2.1

Fix for the missing CSS in --production mode.

# 1.2.0

- Shorthand commands! Run hs to see them all.
- Added an option to revision CSS and JS files for better browser caching.
- Made it possible to tunnel your local server to the web through ngrok.
- Baked in Google Pagespeed Insights so you can quickly check your score while developing.

# 1.1.4

- Better livereloading with Browsersync. Clicks and scrolls will now be synchronised across clients!
- You now get a notification once a day (during usage) if a new update is available.
- You can now reference branches or releases when using init --base.
- Replaced regex that stripped out console.log() statements with a proper module (thanks Sindre).
- Included a fix for a bug that occured when using init on an external drive.
- Cleaned up CLI.

# 1.1.3

- Fixed installation bug.
- Reintroduced conditional comments.
- IE scripts now get separated based on where they need to be used (header or end of body).

# 1.1.2

- Fixed the bug that prevented the live-reloading after a Sass error occurred.

# 1.1.1

- Made Uncss optional as it usually needs configuration to work correctly.

# 1.1.0

- Uncss was added to the production mode
- Image optimization was moved to production mode
- New documentation
- Better templating through Handlebars

# 1.0.0

First public release.