---
title: Anatomy of an Extension
---
# Anatomy of an Extension

This document details the files and structure of a GNOME Shell extension. It may
be used as a reference

Whether you're downloading from a repository (eg. GitHub, GitLab) or installing
from the [GNOME Extensions Website][ego], extensions are distributed as Zip
files with only two required files: `metadata.json` and `extension.js`.

Once unpacked and installed the extension will be in one of two places:

```sh
# User Extension
~/.local/share/gnome-shell/extensions/example@gjs.guide/
    extension.js
    metadata.json

# System Extension
/usr/share/gnome-shell/extensions/example@gjs.guide/
    extension.js
    metadata.json
```

A more complete, zipped extension usually looks like this:

```
example@gjs.guide.zip
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

The topic of GSettings and the `schemas/` directory is explained on the
[Preferences](../development/preferences.html) page.

The topic of Gettext and the `locale/` directory is explained on the
[Translations](../development/translations.html) page.


## `metadata.json` (Required)

`metadata.json` is a required file of every extension. It contains basic
information about the extension such as its UUID, name and description. Below is
a minimal example:

```js
{
    "uuid": "example@gjs.guide",
    "name": "Example",
    "description": "This is an example extension.",
    "shell-version": [ "3.38", "40" ],
    "url": "https://gitlab.gnome.org/World/ShellExtensions/example",
    "version": 1
}
```

There are a number of other, optional fields that `metadata.json` may contain.
Below is a complete example, demonstrating all current possible fields:

```js
{
    "uuid": "example@gjs.guide",
    "name": "Example",
    "description": "This is an example extension.",
    "shell-version": [ "3.38", "40" ],
    "url": "https://gitlab.gnome.org/World/ShellExtensions/example",
    "version": 1,
    "session-modes": ["user", "unlock-dialog"],
    "settings-schema": "org.gnome.shell.extensions.example",
    "gettext-domain": "example@gjs.guide",
}
```

These fields should be pretty self-explanatory, with some simple rules:

### Required Fields

#### `uuid`

This field is a globally-unique identifier for your extension, made of two parts
separated by `@`. Each part must only container letters, numbers, period (`.`),
underscore (`_`) and hyphen (`-`).

The first part should be a short string like "click-to-focus". The second part
must be some namespace under your control, such as `username.github.io`. Common
examples are `click-to-focus@username.github.io` and
`adblock@account.gmail.com`.

An extension's files must be installed to a folder with the same name as `uuid`
to be recognized by GNOME Shell:

```sh
~/.local/share/gnome-shell/extensions/example@gjs.guide/
```

#### `name`

This field should be a short, descriptive string like "Click To Focus",
"Adblock" or "Shell Window Shrinker".

#### `description`

This field should be a relatively short description of the extension's function.
If you need to, you can insert line breaks and tabs by using the `\n` and `\t`
escape sequences.

#### `shell-version`

This field is an array of strings describing the GNOME Shell versions that an
extension supports. It must include at least one entry or the extension will be
uninstallable.

For versions up to and including GNOME 3.38, this should have a major and minor
component such as `"3.38"`. Starting with GNOME 40, it should simply be the
major version, such as `"40"` or `"41"`.

Note that GNOME Shell has a configuration setting,
`disable-extension-version-validation`, which controls whether unsupported
extensions can be loaded. Before GNOME 40 this was `true` by default (users
could install extensions regardless of the `shell-version`), but because of the
major changes it is now `false` by default.

#### `url`

This field is a URL for an extension, which should almost always be a git
repository where the code can be found and issues can be reported.

It is required for extensions submitted to https://extensions.gnome.org/ to have
a valid URL.

#### `version`

This field is the version of your extension, as known to the GNOME Extensions
website, and **MUST** be a whole number like `1`. It **is not** a semantic
version like `1.1` or a string like `"1"`.

This version is automatically incremented by the GNOME Extensions website with
each submission, but many extension developers choose to match their release
versions with this.

### Optional Fields

#### `gettext-domain`

This field is a Gettext translation domain, used by the
`ExtensionUtils.initTranslations()` convenience method to create a object with
methods for marking and retrieving string translations in an extension.

The domain should be unique to your extension and the easiest choice is to use
the UUID from your extension, such as `example@gjs.guide`.

Use of this field is optional and documented in the
[Translations](../development/translations.html) page.

#### `settings-schema`

This field is a [`Gio.SettingsSchema`][gsettingsschema] ID, used by the
`ExtensionUtils.getSettings()` convenience method to create a
[`Gio.Settings`][gsettings] object for an extension.

By convention, the schema ID for extensions all start with the string
`org.gnome.shell.extensions` with the extension ID as a unique identifier, such
as `org.gnome.shell.extensions.example`.

Use of this field is optional and documented in the
[Preferences](../development/preferences.html) page.

[gsettings]: https://gjs-docs.gnome.org/gio20/gio.settings
[gsettingsschema]: https://gjs-docs.gnome.org/gio20/gio.settingsschema

#### `session-modes`

::: warning
This field was added in GNOME 42.
:::

This field is an array of strings describing the GNOME Shell session modes that
the extension supports. Almost all extensions will only use the `user` session
mode, which is the default if this field is not present.

The current possible session modes are:

* `user`

  Extensions that specify this key run during active user sessions. If no other
  session modes are specified, the extension will be enabled when the session is
  unlocked and disabled when it locks.
    
* `unlock-dialog`

  Extensions that specify this key are allowed to run, or keep running, on the
  lock screen.
    
* `gdm`

  Extensions that specify this key are allowed to run, or keep running, on the
  login screen. This session mode is only available for system extensions that
  are enabled for the "gdm" user.
    
Extensions that want to support other session modes must provide a justification
to be approved during review for distribution from the GNOME Extensions website.


## `extension.js` (Required)

`extension.js` is a required file of every extension. It is the core of your
extension and contains the function hooks `init()`, `enable()` and `disable()`
used by GNOME Shell to load, enable and disable your extension.

```js
// This is a handy import we'll use to grab our extension's object
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


class Extension {
    constructor() {
    }
    
    /**
     * This function is called when your extension is enabled, which could be
     * done in GNOME Extensions, when you log in or when the screen is unlocked.
     *
     * This is when you should setup any UI for your extension, change existing
     * widgets, connect signals or modify GNOME Shell's behaviour.
     */
    enable() {
        log(`enabling ${Me.metadata.name}`);
    }
    

    /**
     * This function is called when your extension is uninstalled, disabled in
     * GNOME Extensions, when you log out or when the screen locks.
     *
     * Anything you created, modified or setup in enable() MUST be undone here.
     * Not doing so is the most common reason extensions are rejected in review!
     */
    disable() {
        log(`disabling ${Me.metadata.name}`);
    }
}


/**
 * This function is called once when your extension is loaded, not enabled. This
 * is a good time to setup translations or anything else you only do once.
 *
 * You MUST NOT make any changes to GNOME Shell, connect any signals or add any
 * MainLoop sources here.
 *
 * @param {ExtensionMeta} meta - An extension meta object, described below.
 * @returns {Object} an object with enable() and disable() methods
 */
function init(meta) {
    log(`initializing ${meta.metadata.name}`);
    
    return new Extension();
}
```

There is an alternate pattern which uses top-level functions instead of an
`Extension()` object. You are welcome use whichever pattern best suits you.

```js
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init(meta) {
    log(`initializing ${meta.metadata.name}`);
}


function enable() {
    log(`enabling ${Me.metadata.name}`);
}


function disable() {
    log(`disabling ${Me.metadata.name}`);
}
```

### Extension Meta Object

::: warning
Some properties may only be available in some versions of GNOME Shell, while
others may not be meant for extension authors to use. All properties should be
considered read-only.
:::

An object describing the extension and various properties is available for
extensions to use. This is passed to the `init()` function when an extension is
loaded and can be retrieved by calling `ExtensionUtils.getCurrentExtension()`.

```js
/**
 * @typedef ExtensionMeta
 * @type {object}
 * @property {object} metadata - the metadata.json file, parsed as JSON
 * @property {string} uuid - the extension UUID
 * @property {number} type - the extension type; `1` for system, `2` for user
 * @property {Gio.File} dir - the extension directory
 * @property {string} path - the extension directory path
 * @property {string} error - an error message or an empty string if no error
 * @property {boolean} hasPrefs - whether the extension has a preferences dialog
 * @property {boolean} hasUpdate - whether the extension has a pending update
 * @property {boolean} canChange - whether the extension can be enabled/disabled
 * @property {string[]} sessionModes - a list of supported session modes
 */
```

## `prefs.js`

`prefs.js` is used to build a Gtk widget that will be inserted into a window and
be used as the preferences dialog for your extension. If this file is not
present, there will simply be no preferences button in GNOME Extensions or on
https://extensions.gnome.org/local/.

```js
const {Adw, GLib, Gtk} = imports.gi;

// It's common practice to keep GNOME API and JS imports in separate blocks
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


/**
 * Like `extension.js` this is used for any one-time setup like translations.
 *
 * @param {ExtensionMeta} meta - An extension meta object, described below.
 */
function init(meta) {
    log(`initializing ${meta.metadata.name} Preferences`);
}


/**
 * This function is called when the preferences window is first created to build
 * and return a GTK widget.
 *
 * As of GNOME 42, the preferences window will be a `Adw.PreferencesWindow`.
 * Intermediate `Adw.PreferencesPage` and `Adw.PreferencesGroup` widgets will be
 * used to wrap the returned widget if necessary.
 *
 * @returns {Gtk.Widget} the preferences widget
 */
function buildPrefsWidget() {
    // This could be any GtkWidget subclass, although usually you would choose
    // something like a GtkGrid, GtkBox or GtkNotebook
    const prefsWidget = new Gtk.Box();

    // Add a widget to the group. This could be any GtkWidget subclass,
    // although usually you would choose preferences rows such as AdwActionRow,
    // AdwComboRow or AdwRevealerRow.
    const label = new Gtk.Label({ label: `${Me.metadata.name}` });
    prefsWidget.append(label);
    
    return prefsWidget;
}

/**
 * This function is called when the preferences window is first created to fill
 * the `Adw.PreferencesWindow`.
 *
 * This function will only be called by GNOME 42 and later. If this function is
 * present, `buildPrefsWidget()` will never be called.
 *
 * @param {Adw.PreferencesWindow} window - The preferences window
 */
function fillPreferencesWindow(window) {
    const prefsPage = new Adw.PreferencesPage({
        name: 'general',
        title: 'General',
        icon_name: 'dialog-information-symbolic',
    });
    window.add(prefsPage);
    
    const prefsGroup = new Adw.PreferencesGroup({
        title: 'Appearance',
        description: `Configure the appearance of ${Me.metadata.name}`,
    });
    prefsPage.add(prefsGroup);
    
    const showIndicatorRow = new Adw.ActionRow({
        title: 'Show Indicator',
        subtitle: 'Whether to show the panel indicator',
    });
    prefsGroup.add(showIndicatorRow);
    
    const showIndicatorSwitch = new Gtk.Switch();
    showIndicatorRow.add_suffix(showIndicatorSwitch);
    showIndicatorRow.set_activatable_widget(showIndicatorSwitch);
}
```

Something that's important to understand:

* The code in `extension.js` is executed in the same process as `gnome-shell`
 
  Here you **will** have access to live code running in GNOME Shell, but fatal
  errors or mistakes will affect the stablity of the desktop. It also means you
  will be using the [Clutter][clutter] and [St][st] toolkits, although you may
  still use utility functions and classes from Gtk.
  
* The code in `prefs.js` will be executed in a separate Gtk process

  Here you **will not** have access to code running in GNOME Shell, but fatal
  errors or mistakes will be contained within that process. In this process you
  will be using the [Gtk][gtk] toolkit, not Clutter.

You can open the preferences dialog for your extension manually with
`gnome-extensions prefs`:

```sh
$ gnome-extensions prefs example@gjs.guide
```

## `stylesheet.css`

`stylesheet.css` is CSS stylesheet which can apply custom styles to your St
widgets in `extension.js` or GNOME Shell as a whole. For example, if you had the
following widgets:

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
[adwpreferenceswindow]: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/main/class.PreferencesWindow.html
