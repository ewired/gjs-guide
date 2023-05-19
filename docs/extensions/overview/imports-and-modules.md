---
title: Imports and Modules
---

# Imports and Modules

::: tip
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

```js
'use strict';

// Any imports this extension needs itself must also be imported here
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Most importantly, variables declared with `let` or `const` are NOT exported
const LOCAL_CONSTANT = 42;
let localVariable = 'a value';

// This includes function expressions and classes declared with `class`
let _privateFunction = function() {};

// TIP: Private members are often prefixed with `_` in JavaScript, which is clue
// to other developers that these should only be used internally and may change
class _PrivateClass {
    constructor() {
        this._initialized = true;
    }
}


// Function declarations WILL be available as properties of the module
function exportedFunction(a, b) {
    return a + b;
}

// Use `var` to assign any other members you want available as part the module
var EXPORTED_VARIABLE = 42;

var exportedFunction2 = function(...args) {
    return exportedFunction(...args);
}

var ExportedClass = class ExportedClass extends _PrivateClass {
    construct(params) {
        super();

        Object.assign(this, params);
    }
};
```

## Importing Modules

If placed in `example@gjs.guide/exampleLib.js` the script above would be
available as `Me.imports.exampleLib`. If it was in a subdirectory, such as
`example@gjs.guide/modules/exampleLib.js`, you would access it as
`Me.imports.modules.exampleLib`.

```js
// GNOME Shell imports
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// You can import your modules using the extension object we imported as `Me`.
const ExampleLib = Me.imports.exampleLib;

let myObject = new ExampleLib.ExportedClass();
ExampleLib.exportedFunction(0, ExampleLib.EXPORTED_VARIABLE);
```

Many of the elements in GNOME Shell like panel buttons, popup menus and
notifications are built from reusable classes and functions. These common
elements are the closest GNOME Shell has in terms of stable public API. Here are
a few links to some commonly used modules.

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

### Importing Libraries

Extensions can also import libraries from the GNOME platform, or any other
library supporting [GObject Introspection][gobject-introspection]. There are
also a few built-in libraries such as [`Cairo`][cairo] and [`Gettext`][gettext]
that are slightly different.

```js
// GJS's Built-in Modules are in the top-level of the import object
const Gettext = imports.gettext;
const Cairo = imports.cairo;

// Introspected libraries are under the `gi` namespace
const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;

// Multiple libraries can be imported with object destructuring
const { GLib, GObject, Gio } = imports.gi;
```


[extension-utils]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/misc/extensionUtils.js
[modal-dialog]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/modalDialog.js
[panel-menu]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/panelMenu.js
[popup-menu]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/popupMenu.js
[gobject-introspection]: https://gi.readthedocs.io/en/latest/index.html
[cairo]: https://gjs-docs.gnome.org/gjs/cairo.md
[gettext]: https://gjs-docs.gnome.org/gjs/gettext.md
[esmodules]: https://gjs-docs.gnome.org/gjs/esmodules.md
