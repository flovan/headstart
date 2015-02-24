- [Overview](#overview)
- [Starting a new project](#starting-a-new-project)
- [Initializing a project](#initializing-a-project)
- [Build flags](#build-flags)
- [Building a project](#building-a-project)
- [Making a production-ready build](#making-a-production-ready-build)
- [External services](#external-services)
  - [Web tunneling](#web-tunneling)
  - [Google Pagespeed Insights](#google-pagespeed-insights)

## Overview

To get a quick overview of the Command Line Interface (CLI), run either the long or shorthand command:

````
headstart
hs
````

Both do exactly the same thing, but you'll get to a point where speed gets more important than information! You'll notice further on that most flags also have a shorter notation.

Before starting, point your command line to where your project folder:

````
cd some/where/on/your/machine/my-project
````

If you don't feel comfortable traversing your filesystem like this, you can achieve the same result on a Mac by dragging any folder onto the Command Line icon, or on a Windows machine by right clicking any folder while holding the Shift key and choosing "Open command window from here".

## Starting a new project

Download a fresh copy of [the boilerplate files][boilerplate-url] by running:

````
headstart new
hs new
````

When the downloading is completed, you'll be automatically prompted to initiate the project as well.

## Initializing a project

Initializing a new project requires the following command:

````
headstart init
hs init
````

This will ~~fetch javascript dependencies and~~ ask you a bunch of question to further configure the skelleton project to your specific use-case. This includes deciding on whether or not you'd like a Javascript library, as well as filling in the title, description, etc.

After this process, you will be automatically prompted to start building the project.

## Building a project

There are multiple ways to start the build process. This command will get you useable but unoptimized files, and will stop when completed. It's the most rudimentary form of building:

````
headstart build
hs build
````

## Build flags

The following command keeps the build engine running, and takes care of automatic browser reloads and synchronised scrolling and clicking on connected clients:

````
headstart build --serve
hs build --s
````

But you can even open up a browser *and* a code editor on top of that:

````
headstart build --serve --open --edit
hs build --s --o --e
````

## Making a production-ready build

Prepare your files for deployment by running the build engine in production mode:

````
headstart build --production
hs build --p
````

> **Tip:** Can also be used in combination with `--serve`

The production flag will optimize your files (as defined in the project configuration), including:

- Optimizing images and SVG files
- Generating favicons and touch icons
- Generating a .htaccess file from the htaccess template
- Copying miscellaneous files (`robots.txt`, `humas.txt`, etc.) to the root directory
- Concatenating and uglifying javascript files, and taking out development code (eg. `console.log()` and `alert()`) and libraries.
- Concatenating media queries
- Minifying stylesheets
- Minifying HTML
- Revisioning assets

## External services

### Web tunneling

Headstart makes it possible to expose your static file server to the internet. This way you can share whatever you're building with the world, without the need to upload anything.

````
headstart build --serve --tunnel
hs build --s --t
````

If you'd like to get a friendlier subdomain, you can try requesting one by passing a value to the tunnel flag:

````
headstart build --serve --tunnel=cool-project
hs build --s --t=cool-project
````

Running this will try to get you `http://cool-project.localtunnel.me`.

Credits for this go to the Localtunnel service, which is maintained by [@defunctzombie][localtunnel-twitter].

### Google Pagespeed Insights

[Google's Pagespeed Insights](gpi-url) is a nice and free-to-use tool to check if your project if performing well enough.

To enable you to check timely and frequently, a module which can talk to their API has been integrated into Headstart. In order to use this, you will also need to use [the tunneling service](#web-tunneling) described above. By default, the module checks for the desktop strategy, but this can easily be changes trough an extra flag:

````
headstart build --serve --tunnel --psi
hs build --s --t --psi

headstart build --serve --tunnel --psi --strategy=mobile
hs build --s --t --psi --strategy=mobile
````

[boilerplate-url]: https://github.com/flovan/headstart-boilerplate
[localtunnel-twitter]: https://twitter.com/defunctzombie
[gpi-link]: https://developers.google.com/speed/pagespeed/insights/