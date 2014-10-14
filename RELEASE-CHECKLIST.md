## Release checklist

A list of things that need to work for each and every release.

### Initialising

- [ ] Boilerplate files have been updated and packaged into a release
- [ ] The latest boilerplate release can be scaffolded through `hs init` *and* `headstart init`
- [ ] Files can be served through the init
- [ ] A browser can be opened from the init
- [ ] An editor can be opened from the init

### CLI testing

- [ ] A build is successfull through `hs build` *and* `headstart build`
- [ ] A production build is success through `hs build --p` *and* `headstart build --p` *and* `hs build --production` *and* `headstart build --production`
- [ ] Files can be served in development through `hs build --s` *and* `headstart build --s` *and* `hs build --serve` *and* `headstart build --serve`
- [ ] Files can be served in production through `hs build --s --p` *and* `headstart build --s --p` *and* `hs build --serve --production` *and* `headstart build --serve --production`
- [ ] A browser can be opened through `hs build --s --o` *and* `headstart build --s --o` *and* `hs build --serve --open` *and* `headstart build --serve --open`
- [ ] A browser can not be opened without `--s`
- [ ] An editor can be opened through `hs build --e` *and* `headstart build --e` *and* `hs build --edit` *and* `headstart build --edit` *and* `hs build --s --e` *and* `headstart build --s --e` *and* `hs build --s --edit` *and* `headstart build --s --edit`

### Development



### Production

- [ ] A `.favicon` is generated in the root
- [ ] A `.htaccess` is generated in the root
- [ ] All `./misc` files are copied over to the root