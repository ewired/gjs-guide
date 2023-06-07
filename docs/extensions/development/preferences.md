---
title: Preferences
---

# Preferences

Our preferences dialog will be written in [Gtk][gtk], which gives us a lot of
options for how we present settings to the user. You may consider looking
through the GNOME Human Interface Guidelines, or widget galleries for ideas.

#### See Also

* [GNOME HIG](https://developer.gnome.org/hig)
* [GTK4 Widget Gallery](https://docs.gtk.org/gtk4/visual_index.html)
* [libadwaita Widget Gallery](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/widget-gallery.html)

## GSettings

[GSettings][gsettings] provides a simple, extremely fast API for storing
application settings, that can also be used by GNOME Shell extensions.

[gsettings]: https://gjs-docs.gnome.org/gio20/gio.settings

### Creating a Schema

::: tip
A GSettings schema ID with the prefix `org.gnome.shell.extensions` and a path
with the prefix `/org/gnome/shell/extensions` is the standard for extensions.
:::

Schema files describe the types and default values of a particular group of
settings, using the same type format as [GVariant][gvariant-format]. The first
thing to do is create a subdirectory for your settings schema and open the
schema file in your editor:

```sh
$ cd ~/.local/share/gnome-shell/extensions/example@gjs.guide/
$ mkdir schemas/
$ gedit schemas/org.gnome.shell.extensions.example.gschema.xml
```

Then using your edit, create a schema describing the settings for your extension:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<schemalist>
  <schema id="org.gnome.shell.extensions.example" path="/org/gnome/shell/extensions/example/">
    <!-- See also: https://docs.gtk.org/glib/gvariant-format-strings.html -->
    <key name="show-indicator" type="b">
      <default>true</default>
    </key>
  </schema>
</schemalist>
```

### Compiling a Schema

::: tip
As of GNOME 44, settings schemas are compiled automatically for extensions
installed with the `gnome-extensions` tool, [GNOME Extensions][ego] website, or
a compatible application like [Extension Manager][extension-manager].
:::

Before it can be used, a GSettings schema must be compiled. If not using the
`gnome-extensions` tool, `glib-compile-schemas` can be used to compile schemas:

```sh
$ glib-compile-schemas schemas/
$ ls schemas/
org.gnome.shell.extensions.example.gschema.xml  gschemas.compiled
```

[ego]: https://extensions.gnome.org
[extension-manager]: https://flathub.org/apps/com.mattjakeman.ExtensionManager

### Integrating GSettings

::: tip
For complex settings, see the [`GVariant Guide`][gvariant-guide] for examples of
what data types can be stored with GSettings.
:::

To make using GSettings easier in an extension, set the
[`settings-schema`](../overview/anatomy.md#settings-schema) field in
[`metadata.json`](../overview/anatomy.md#metadata-json-required):

@[code json](@src/extensions/development/preferences/metadata.json)

With this field set, [`ExtensionUtils.getSettings()`][utils-getsettings] can be
called with no arguments. Otherwise you may pass any valid GSettings schema ID.

Methods like [`Gio.Settings.get_boolean()`][gsettings-getboolean] are used for
native values, or methods like [`Gio.Settings.set_value()`][gsettings-setvalue]
can be used to work with `GLib.Variant` directly.

For simple types like `Boolean`, [`Gio.Settings.bind()`][gsettings-bind] can
bind to a [GObject Property](../../guides/gobject/basics.md#gobject-properties).
For JavaScript properties and other use cases, `Gio.Settings` emits
[`Gio.Settings::changed`][gsettings-changed] with the property name as the
signal detail (e.g. `changed::show-indicator`).

@[code js](@src/extensions/development/preferences/extension.js)


[gvariant-guide]: ../../guides/glib/gvariant.md
[gsettings]: https://gjs-docs.gnome.org/gio20/gio.settings
[gsettings-bind]: https://gjs-docs.gnome.org/gio20/gio.settings#method-bind
[gsettings-getboolean]: https://gjs-docs.gnome.org/gio20/gio.settings#method-get_boolean
[gsettings-setvalue]: https://gjs-docs.gnome.org/gio20/gio.settings#method-set_value
[gsettings-changed]: https://gjs-docs.gnome.org/gio20/gio.settings#signal-changed
[utils-getsettings]: ../topics/extension-utils.md#extensionutils-getsettings-schema

## Preferences Window

::: tip
Extension preferences run in a separate process, without access to code in
GNOME Shell, and are written with [GTK][gtk] and [libadwaita][adw].
:::

Extensions should implement `fillPreferencesWindow()`, which is passed a new
instance of [`Adw.PreferencesWindow`][adw-preferenceswindow] before it is
displayed to the user.

libadwaita has many widgets that make building a preferences dialog easier, with
screenshots available in the [Widget Gallery][adw-widget-gallery]. You may also
use any of the [other APIs](https://gjs-docs.gnome.org) that are compatible with
GTK4 (notable exceptions include `Meta`, `Clutter`, `Shell` and `St`).

@[code js](@src/extensions/development/preferences/prefs.js)

The preference dialog can be opened with `gnome-extensions prefs`, or any other
tool for managing extensions:

<img :src="$withBase('/assets/img/gnome-extensions-example-prefs.png')" />

[gtk]: https://gjs-docs.gnome.org/gtk40/
[adw]: https://gjs-docs.gnome.org/adw1/
[adw-preferenceswindow]: https://gjs-docs.gnome.org/adw1/adw.preferenceswindow
[adw-widget-gallery]: https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/widget-gallery.html


## Debugging

Because preferences are not run within `gnome-shell` but in a separate process,
the logs will appear in the `gjs` process:

```sh
journalctl -f -o cat /usr/bin/gjs
```


[gsettings]: https://gjs-docs.gnome.org/gio20-settings/
[gvariant-format]: https://docs.gtk.org/glib/gvariant-format-strings.html
