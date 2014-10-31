## Release checklist

A list of things that need to work for each and every release.

### Initialising

- [ ] Boilerplate files have been updated and packaged into a release
- [ ] The latest boilerplate release can be scaffolded through `hs init` *and* `headstart init`
- [ ] Files can be served through the init
- [ ] A browser can be opened from the init
- [ ] An editor can be opened from the init

### CLI testing

- [ ] A build is successfull through `hs build`
- [ ] A production build is success through `hs build --p` *and* `hs build --production`
- [ ] Files can be served in development through `hs build --s` *and* `hs build --serve`
- [ ] Files can be served in production through `hs build --s --p` *and* `hs build --serve --production`
- [ ] A browser can be opened through `hs build --s --o` *and* `hs build --serve --open`
- [ ] A browser can not be opened without `--s`
- [ ] An editor can be opened through `hs build --e` *and* `hs build --edit` *and* `hs build --s --e` *and* `hs build --s --edit`
- [ ] A tunnel can be initiated through `hs build --s --t` *and* `hs build --s --tunnel`
- [ ] A custom tunnel can be initiated through `hs build --s --t=bla` *and* `hs build --s --tunnel=bla` and returns `bla.localtunnel.me` (or something) when available
- [ ] Google PSI can be initiated through `hs build --s --t --psi`
- [ ] The "mobile" PSI strategy can be set through `hs build --s --t --psi --strategy=mobile`
- [ ] Google PSI can not be initiated without both `--s` and `--t`

### Development

- [ ] JS files get injected
- [ ] Changes to JS files reload the page
- [ ] Added/deleted JS files reload the page and update the injected files
- [ ] CSS files get injected
- [ ] Changes to CSS files update the page
- [ ] Added/deleted CSS files reload the page and update the injected files
- [ ] Images get copied over
- [ ] Changes to images trigger a reload

### Production

- [ ] A `.favicon` is generated in the root
- [ ] A `.htaccess` is generated in the root
- [ ] All `./misc` files are copied over to the root