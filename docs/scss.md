# CSS

Headstart's CSS is powered by SASS (SCSS), and utilizes a custom grid system based on [Suzy](http://susy.oddbird.net).

## Common sheet

The `common.scss` file is used to bundle all the global styles. Included are Normalize, Print and a heap of optional modules (eg Form, text, button, reporting).

## Page specific sheets

The page-specific sheets (eg. the `view-index.scss` file) will be injected automatically in their respective page.

> __NOTE: File names should be prefixed with "view-", followed by the name of the target .html file__

## Internet Explorer

The `ie.scss` file is where you should put all your IE specific hacks and fixes. It is included conditionally so normal browsers won't receive this.

## Folder structure

The folder structure and base file setup is based on [BEM](http://bem.info/method/definitions/) and [SMACSS](http://smacss.com).

 + __base__ — These file contain settings, function and states and do not generate CSS.
   - __config_global__ — Imports libraries and mixins and sets some global variables.
   - __config_site__ — Contains project specific variables; colors and font-stack.
   - __functions__ — Functions to strip units and set em values.
   - __states__ — Placeholders to @extend from, great for keeping things DRY
 + __mixin__
   - __all__ — Imports all other mixins
   - __grid__ — Super-easy fluid and responsive grids (see below)
   - __media__ — Mixins for all the media queries you'll need (see below)
   - __triangle__ — Make a CSS triangle
 + __module__
   - __button__ — All kinds of buttons, put them here
   - __container__ — Create a centered, fluid, yet max-width container
   - __font__ — Put font-face stuff here
   - __form__ — Styles targeted at forms and form elements go in here
   - __normalize__
   - __print__
   - __reporting__ — Error/Success/Info/Warning styles with pretty default colors
   - __text__ — All text related styles go in here (headings, links, paragraphs)

## The Grid

The grid system of Headstart is inspired by Susy, but stripped down to the bare basics.
How to use:

    // column($columns, $end, $break, $context)
    
    aside {
      @include column(3);
    }
    article {
      @include column(9, true);
    }

Take a look at the [_grid.scss](https://github.com/flovan/Headstart/blob/master/app/sass/mixin/_grid.scss) file for all parameters.

## Media queries

With proper gzipping, you can keep your media queries close to your elements, rather then bundled at the bottom, with nex to no speed impact.

How to use:

    // media-min($value)
    // media-max($value)
    // media-min-max($valueMin, $valueMax)
    // highres()
    
    div
    {
      @include media-mix(400px){ background-color: red; }
      @include highres(){
        background-image: url(../images/something@2x.png);
        background-size: 100px 100px;
      }
    }

Take a look at the [_media.scss](https://github.com/flovan/Headstart/blob/master/app/sass/mixin/_media.scss) file for all parameters.
