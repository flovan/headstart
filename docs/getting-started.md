- [Getting started](#getting-started)
- [Prerequisites](#prerequisites)
- [Postrequisites](#postrequisites)

## Getting started

> **First-time users:** Check the [prerequisites](#prerequisites) below before continuing.

Install Headstart globally:

````
npm install -g headstart
````

And sit back while NPM downloads, builds and installs Headstart.  
If you see `Permission denied` or `Error: EACCES`, run the command again with `sudo` added at the start.

Open up the [CLI documentation](cli.md) and get to know all of the available commands.

## Prerequisites

### 1. A command line application

Headstart instances live in the command line, which is where you'll be entering all the command you find in this document. There are lots of options, but you'll do just fine with the default application:

- **OS X: Terminal.app** ~ Applications/Utilities
- **Windows: Command Prompt** ~ Start > All Programs > Accessories > Command Prompt
- **Linux: Shell Prompt** ~ You're using Linux, so you should know where to find it!

### 2. NodeJS and NPM

Headstart runs on NodeJS and is installed with NPM, a package manager for Node. You can download the appropriate installer for your system through [the NodeJS website][nodejs-website].

### 3. Git

Some Headstart modules are fetched directly from Github, rather than NPM. For this reason you'll need to have Git installed as well. You can check if you have it installed by running:

````
git --version
````

If you don't see a version number written out, you need to [install Git][git-website]

## Postrequisites (optional)

###Ruby and Sass

Headstart V2 uses [libsass][libsass-url] to compile SCSS by default. There is support for the original Ruby gem as well, so if you are planning on using that, you'll need to perform two more checks before being able to start.

Run the following command to check if you have Ruby installed:

````
ruby -v
````

If you don't see a version number written out, you need to [install Ruby][ruby-installation].

Then run the following command to check if you have Sass installed:

````
sass -v
````

If you don't see a version number written out, you need to install Sass:

````
gem install sass
````

[nodejs-website]: http://nodejs.org/download/
[git-website]: http://git-scm.com/
[libsass-url]: http://libsass.org
[ruby-installation]: https://www.ruby-lang.org/en/documentation/installation/