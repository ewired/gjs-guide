---
title: Anatomy of an Extension
---
# Anatomy of an Extension

This document details the files and structure of a GNOME Shell extension. For
documentation on how to create and develop your first extension, see the
[Development](../#development) section of the extensions guide.

## Extension ZIP

Whether you're downloading from a repository (e.g. GitHub, GitLab) or installing
from the [GNOME Extensions Website][ego], extensions are distributed as Zip
files with only two required files: `metadata.json` and `extension.js`.

Once unpacked and installed, the extension will be in one of two places:

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

@[code json](@src/extensions/overview/anatomy/metadataRequired.json)

There are a number of other, optional fields that `metadata.json` may contain.
Below is a complete example, demonstrating all current possible fields:

@[code json](@src/extensions/overview/anatomy/metadata.json)

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

### Optional Fields

#### `gettext-domain`

This field is a Gettext translation domain, used by the
`ExtensionUtils.initTranslations()` convenience method to create an object with
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

#### `version`

This field is the submission version of an extension, as known to the GNOME
Extensions website, and **MUST** be a whole number like `1`. It **is not** a
semantic version like `1.1` or a string like `"1"`.

This field is set and incremented automatically by the GNOME Extensions website
with each submission, but many extension developers choose to match their
release versions with this.

#### `donations`

This field is an object including donation links with these possible keys:

- buymeacoffee
- custom
- github
- kofi
- patreon
- paypal

Value of each element can be string or array of strings (maximum array
length is 3).

While `custom` pointing to the exact value (URL), other keys only including
the user handle (for example, `"paypal": "john_doe"` points to the
`https://paypal.me/john_doe`).

## `extension.js` (Required)

`extension.js` is a required file of every extension. It is the core of your
extension and contains the function hooks `init()`, `enable()` and `disable()`
used by GNOME Shell to load, enable and disable your extension.

There are two ways `extension.js` can be implemented. The first requires a
top-level `init()` function that returns an object with with `enable()` and
`disable()` methods.

@[code js](@src/extensions/overview/anatomy/extension.js)

The second approach requires `init()`, `enable()` and `disable()` as top-level
functions. You are welcome use whichever pattern best suits you.

@[code js](@src/extensions/overview/anatomy/extensionModule.js)

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

::: tip
As of GNOME 40, extension preferences depend on GTK4 and will not work with
GTK3 or libraries that depend on it like libhandy.
:::

`prefs.js` is used to build the preferences for an extensions. If this file is
not present, there will simply be no preferences button in GNOME Extensions or
the [GNOME Extensions Website](https://extensions.gnome.org/local/).

@[code js](@src/extensions/overview/anatomy/prefs.js)

Something that's important to understand:

* The code in `extension.js` is executed in the same process as `gnome-shell`
 
  Here you **will** have access to live code running in GNOME Shell, but fatal
  errors or mistakes will affect the stability of the desktop. It also means you
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

::: tip
The CSS in this file will only apply to GNOME Shell and extensions, not the
extension preferences or any other application.
:::

`stylesheet.css` is CSS stylesheet which can apply custom styles to your widgets
in `extension.js` or GNOME Shell as a whole. For example, if you had the
following widgets:

@[code js](@src/extensions/overview/anatomy/stylesheet.js)

You could have this in your `stylesheet.css`:

@[code css](@src/extensions/overview/anatomy/stylesheet.css)

[ego]: https://extensions.gnome.org

[clutter]: https://gjs-docs.gnome.org/#q=clutter
[st]: https://gjs-docs.gnome.org/st10/
[gtk]: https://gjs-docs.gnome.org/gtk30/
[adwpreferenceswindow]: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/main/class.PreferencesWindow.html
