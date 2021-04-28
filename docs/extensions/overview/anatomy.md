---
title: Anatomy of an Extension
---
# Anatomy of an Extension

## Contents

1. [Extension Zip](#extension-zip)
2. [`metadata.json` (Required)](#metadata-json-required)
3. [`extensions.js` (Required)](#extension-js-required)
4. [`prefs.js`](#prefs-js)
5. [`stylesheet.css`](#stylesheet-css)

## Extension Zip

Whether you're downloading from a repository (eg. GitHub, GitLab) or installing from the [Extensions Website][ego], extensions are distributed as Zip files with only two required files: `metadata.json` and `extension.js`.

A more complete, zipped extension usually looks like this:

```
example@shell.gnome.org.zip
    locale/
        de/
          LC_MESSAGES/
              example.mo
    schemas/
        gschemas.compiled
        org.gnome.shell.extensions.example.gschema.xml
    extension.js
    metadata.json
    prefs.js
    stylesheet.css
```

Once unpacked and installed the extension will be in one of two places:

```
// User Extension
~/.local/share/gnome-shell/extensions/example@shell.gnome.org/
    extension.js
    metadata.json
    ...

// System Extension
/usr/share/gnome-shell/extensions/example@shell.gnome.org/
    extension.js
    metadata.json
    ...
```

The topic of GSettings and `schemas/` is explained on the [Preferences](../development/preferences.html) page. Gettext and `locale/` is explained on the [Translations](../development/translations.html) page.


## metadata.json (Required)

`metadata.json` is a required file of every extension. It contains basic information about the extension including its name, a description, version and a few other things. Below is a complete example:

```js
{
    "uuid": "example@shell.gnome.org",
    "name": "Example",
    "description": "This is an example extension.",
    "version": 1,
    "shell-version": [ "3.38", "40" ],
    "url": "https://gitlab.gnome.org/World/ShellExtensions/example"
}
```

These fields should be pretty self-explanatory, with some simple rules:

### `uuid`

`uuid` is a globally-unique identifier for your extension, made of two parts separated by `@`. An extension's files must be installed to a folder with the same name as `uuid`:

```sh
~/.local/share/gnome-shell/extensions/example@shell.gnome.org/
```

The first part should be a simple string (possibly a variation of the extension name) like "click-to-focus" and the second part should be some namespace under your control such as `username.github.io`. Common examples are `myextension@account.gmail.com` and `my-extension@username.github.io`.

### `name`

`name` should be a short, descriptive string like "Click To Focus", "Adblock" or "Shell Window Shrinker".

### `description`

`description` should be a relatively short description of the extension's function. If you need to, you can insert line breaks and tabs by using the `\n` and `\t` escape sequences.

### `shell-version`

`shell-version` is an array of strings describing which GNOME Shell versions your extension supports. It must include at least one entry or your extension will be uninstallable.

For versions up to and including GNOME 3.38, you should use a major and minor version such as `"3.38"`. Starting with GNOME 40, you should simply use the major version, such as `"40"` or `"41"`.

Note that GNOME Shell has a configuration setting, `disable-extension-version-validation`, which controls whether unsupported extensions can be loaded. Before GNOME 40 this was `true` by default (users could install extensions regardless of the `shell-version`), but because of the major changes it is now `false` by default.

### `url`

`url` is required for extensions submitted to https://extensions.gnome.org/ and usually points to a Github or GitLab repository. It should at least refer to a website where users can report issues and get help using the extension.

### `version`

`version` is the version of your extension and should be a whole number like `1`, **not** a semantic version like `1.1` or a string like `"1"`.

### `settings-schema` & `gettext-domain`

These two fields are optional and are use by the `ExtensionUtils` module which has two helper functions for initializing GSettings and Gettext translations. `settings-schema` should be a GSchema Id like `org.gnome.shell.extensions.example` and `gettext-domain` should be a unique domain for your extension's translations. You could use the same domain as your GSchema Id or the UUID of your extension like `example@shell.gnome.org`.


## `extension.js` (Required)

`extension.js` is a required file of every extension. It is the core of your extension and contains the function hooks `init()`, `enable()` and `disable()` used by GNOME Shell to load, enable and disable your extension.

```js
// This is a handy import we'll use to grab our extension's object
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


class Extension {
    constructor() {
    }
    
    // This function is called when your extension is enabled, which could be
    // done in GNOME Extensions, when you log in or when the screen is unlocked.
    //
    // This is when you should setup any UI for your extension, change existing
    // widgets, connect signals or modify GNOME Shell's behaviour.
    enable() {
        log(`enabling ${Me.metadata.name}`);
    }
    

    // This function is called when your extension is uninstalled, disabled in
    // GNOME Extensions, when you log out or when the screen locks.
    //
    // Anything you created, modifed or setup in enable() MUST be undone here.
    // Not doing so is the most common reason extensions are rejected in review!
    disable() {
        log(`disabling ${Me.metadata.name}`);
    }
}


// This function is called once when your extension is loaded, not enabled. This
// is a good time to setup translations or anything else you only do once.
//
// You MUST NOT make any changes to GNOME Shell, connect any signals or add any
// MainLoop sources here.
function init() {
    log(`initializing ${Me.metadata.name}`);
    
    return new Extension();
}
```

There is an alternate pattern which uses top-level functions instead of an
`Extension()` object. You are welcome use whichever pattern best suits you.

```js
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
    log(`initializing ${Me.metadata.name}`);
}


function enable() {
    log(`enabling ${Me.metadata.name}`);
}


function disable() {
    log(`disabling ${Me.metadata.name}`);
}
```

## `prefs.js`

`prefs.js` is used to build a Gtk widget that will be inserted into a window and be used as the preferences dialog for your extension. If this file is not present, there will simply be no preferences button in GNOME Extensions or on https://extensions.gnome.org/local/.

```js
'use strict';

const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

// It's common practice to keep GNOME API and JS imports in separate blocks
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


// Like `extension.js` this is used for any one-time setup like translations.
function init() {
    log(`initializing ${Me.metadata.name} Preferences`);
}


// This function is called when the preferences window is first created to build
// and return a Gtk widget. As an example we'll create and return a GtkLabel.
function buildPrefsWidget() {
    // This could be any GtkWidget subclass, although usually you would choose
    // something like a GtkGrid, GtkBox or GtkNotebook
    let prefsWidget = new Gtk.Label({
        label: `${Me.metadata.name}`,
        visible: true
    });

    // At the time buildPrefsWidget() is called, the window is not yet prepared
    // so if you want to access the headerbar you need to use a small trick
    GLib.timeout_add(0, () => {
        let window = prefsWidget.get_toplevel();
        let headerBar = window.get_titlebar();
        headerbar.title = `${Me.metadata.name} Preferences`;
        
        return GLib.SOURCE_REMOVE;
    });

    return prefsWidget;
}
```

Something that's important to understand:

* The code in `extension.js` is executed in the same process as `gnome-shell`
 
  Here you **will** have access to live code running in GNOME Shell, but fatal errors or mistakes will affect the stablity of the desktop. It also means you will be using the [Clutter][clutter] and [St][st] toolkits, although you may still use utility functions and classes from Gtk.
  
* The code in `prefs.js` will be executed in a separate Gtk process

  Here you **will not** have access to code running in GNOME Shell, but fatal errors or mistakes will be contained within that process. In this process you will be using the [Gtk][gtk] toolkit, not Clutter.

You can open the preferences dialog for your extension manually with `gnome-extensions prefs`:

```sh
$ gnome-extensions prefs example@shell.gnome.org
```

## `stylesheet.css`

`stylesheet.css` is CSS stylesheet which can apply custom styles to your St widgets in `extension.js` or GNOME Shell as a whole. For example, if you had the following widgets:

```js
// A standard StLabel
let label = new St.Label({
    text: 'LabelText',
    style_class: 'example-style'
});

// An StLabel subclass with `CssName` set to "ExampleLabel"
var ExampleLabel = GObject.registerClass({
    GTypeName: 'ExampleLabel',
    CssName: 'ExampleLabel'
}, class ExampleLabel extends St.Label {
});

let exampleLabel = new ExampleLabel({
    text: 'Label Text'
});
```

You could have this in your `stylesheet.css`:

```css
/* This will change the color of all StLabel elements */
StLabel {
    color: red;
}

/* This will change the color of all elements with the "example-style" class */
.example-style {
    color: green;
}

/* This will change the color of StLabel elements with the "example-style" class */
StLabel.example-style {
    color: blue;
}

/* This will change the color of your StLabel subclass with the custom CssName */
ExampleLabel {
    color: yellow;
}
```

[ego]: https://extensions.gnome.org

[clutter]: https://gjs-docs.gnome.org/#q=clutter
[st]: https://gjs-docs.gnome.org/st10/
[gtk]: https://gjs-docs.gnome.org/gtk30/

