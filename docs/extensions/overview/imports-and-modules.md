---
title: Imports and Modules
---

# Imports and Modules

::: warning
Note that as of GNOME 44, neither GNOME Shell nor Extensions support
[ESModules][esmodules], and must use GJS's custom import scheme.
:::

There are effectively two types of modules that can imported in GJS, the most
common being libraries in the GNOME platform, and the other being JavaScript
files.

## Exporting Modules

Larger extensions or extensions with discrete components often separate code
into modules, including GNOME Shell. You can put code to be exported into `.js`
files and import them in `extension.js`, `prefs.js` or each other.

The basic rules of exporting with GJS's import system are that anything defined
with `var` will be exported, while anything defined with `const` or `let` will
NOT be exported.

@[code js](@src/extensions/overview/imports-and-modules/exportingModules.js)

## Importing Modules

If placed in `example@gjs.guide/exampleLib.js` the script above would be
available as `Me.imports.exampleLib`. If it was in a subdirectory, such as
`example@gjs.guide/modules/exampleLib.js`, you would access it as
`Me.imports.modules.exampleLib`.

@[code js](@src/extensions/overview/imports-and-modules/importingModules.js)

Many of the elements in GNOME Shell like panel buttons, popup menus and
notifications are built from reusable classes and functions, found in modules
like these:

* [`js/misc/extensionUtils.js`][extension-utils]
* [`js/ui/modalDialog.js`][modal-dialog]
* [`js/ui/panelMenu.js`][panel-menu]
* [`js/ui/popupMenu.js`][popup-menu]

You can browse around in the `js/ui/` folder or any other JavaScript file under
`js/` for more code to be reused. Notice the path structure in the links above
and how they compare to the imports below:

```js
const ExtensionUtils = imports.misc.extensionUtils;
const ModalDialog = imports.ui.modalDialog;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
```

## Importing Libraries

Extensions can import libraries from the GNOME platform, or any other library
supporting [GObject Introspection][gobject-introspection]. There are also a few
built-in libraries such as [`Cairo`][cairo] and [`Gettext`][gettext] that are
imported differently.

@[code js](@src/extensions/overview/imports-and-modules/importingLibraries.js)


[extension-utils]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/misc/extensionUtils.js
[modal-dialog]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/modalDialog.js
[panel-menu]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/panelMenu.js
[popup-menu]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/popupMenu.js
[gobject-introspection]: https://gi.readthedocs.io/en/latest/index.html
[cairo]: https://gjs-docs.gnome.org/gjs/cairo.md
[gettext]: https://gjs-docs.gnome.org/gjs/gettext.md
[esmodules]: https://gjs-docs.gnome.org/gjs/esmodules.md
