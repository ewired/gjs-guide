---
title: Imports & Modules
---

# Imports & Modules

It's common for larger extensions or extensions with discrete components to separate code into modules. You can put code to be imported into `.js` files and import them in `extension.js`, `prefs.js` or each other.

```js
'use strict';

// Any imports this extension needs itself must also be imported here
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Mose importantly, variables declared with `let` or `const` are not exported
const LOCAL_CONSTANT = 42;
let localVariable = 'a value';

// This includes function expressions and classes declared with `class`
let _privateFunction = function() {};

// TIP: Private members are often prefixed with `_` in JavaScript, which is clue
// to other developers that these should only be used internally and may change
class _PrivateClass {
    constructor() {
        this._initted = true;
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

If placed in `example@shell.gnome.org/exampleLib.js` the script above would be available as `Me.imports.extensionLib`. If it was in a subdirectory, such as `example@shell.gnome.org/modules/exampleLib.js`, you would access it as `Me.imports.modules.exampleLib`.

```js
// GJS's Built-in Modules are in the top-level
// See: https://gitlab.gnome.org/GNOME/gjs/wikis/Modules
const Gettext = imports.gettext;
const Cairo = imports.cairo;

// GNOME APIs are under the `gi` namespace (except Cairo)
// See: http://devdocs.baznga.org/
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

// GNOME Shell imports
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// You can import your modules using the extension object we imported as `Me`.
const ExampleLib = Me.imports.exampleLib;

let myObject = new ExampleLib.ExportedClass();
ExampleLib.exportedFunction(0, ExampleLib.EXPORTED_VARIABLE);
```

Many of the elements in GNOME Shell like panel buttons, popup menus and notifications are built from reusable classes and functions. These common elements are the closest GNOME Shell has in terms of stable public API. Here are a few links to some commonly used modules.

* [js/misc/extensionUtils.js][extension-utils]
* [js/ui/modalDialog.js][modal-dialog]
* [js/ui/panelMenu.js][panel-menu]
* [js/ui/popupMenu.js][popup-menu]

You can browse around in the `js/ui/` folder or any other JavaScript file under `js/` for more code to be reused. Notice the path structure in the links above and how they compare to the imports below:

```js
const ExtensionUtils = imports.misc.extensionUtils;
const ModalDialog = imports.ui.modalDialog;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
```


[extension-utils]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/master/js/misc/extensionUtils.js
[modal-dialog]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/master/js/ui/modalDialog.js
[panel-menu]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/master/js/ui/panelMenu.js
[popup-menu]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/master/js/ui/popupMenu.js

