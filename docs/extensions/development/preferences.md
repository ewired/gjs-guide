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

```js
{
    "uuid": "example@gjs.guide",
    "name": "Example",
    "description": "This is an example extension.",
    "shell-version": [ "3.38", "40" ],
    "url": "https://gitlab.gnome.org/World/ShellExtensions/example",
    "settings-schema": "org.gnome.shell.extensions.example"
}
```

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

```js
const Gio = imports.gi.Gio;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const _ = ExtensionUtils.gettext;


class Extension {
    constructor() {
        this._indicator = null;
    }
    
    enable() {
        console.debug(`enabling ${Me.metadata.name}`);

        const indicatorName = _('%s Indicator').format(Me.metadata.name);
        
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);

        // Open the preferences when the indicator is clicked
        this._indicator.connect('clicked', () => ExtensionUtils.openPrefs());
        
        // Add an icon
        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        // `Main.panel` is the actual panel you see at the top of the screen,
        // not a class constructor.
        Main.panel.addToStatusArea(indicatorName, this._indicator);

        // Create a new GSettings object, and bind the "show-indicator"
        // setting to the "visible" property.
        this.settings = ExtensionUtils.getSettings();
        this.settings.bind('show-indicator', this._indicator, 'visible',
            Gio.SettingsBindFlags.DEFAULT);

        // Watch for changes to a specific setting
        this.setting.connect('changed::show-indicator', (settings, key) => {
            console.debug(`${key} = ${settings.get_value(key).print(true)}`);
        });
    }
    
    disable() {
        console.debug(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
        this.settings = null;
    }
}


function init() {
    console.debug(`initializing ${Me.metadata.name}`);

    ExtensionUtils.initTranslations();
    
    return new Extension();
}
```

[gvariant-guide]: ../../guides/glib/gvariant.md
[gsettings]: https://gjs-docs.gnome.org/gio20/gio.settings
[gsettings-bind]: https://gjs-docs.gnome.org/gio20/gio.settings#method-bind
[gsettings-get_boolean]: https://gjs-docs.gnome.org/gio20/gio.settings#method-get_boolean
[gsettings-set_value]: https://gjs-docs.gnome.org/gio20/gio.settings#method-set_value
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

```js
'use strict';

const { Adw, Gio, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const _ = ExtensionUtils.gettext;


function init() {
    ExtensionUtils.initTranslations();
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();
    
    // Create a preferences page, with a single group
    const page = new Adw.PreferencesPage();
    window.add(page);

    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({ title: _('Show Extension Indicator') });
    group.add(row);

    // Create a switch and bind its value to the `show-indicator` key
    const toggle = new Gtk.Switch({
        active: settings.get_boolean('show-indicator'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind('show-indicator', toggle, 'active',
        Gio.SettingsBindFlags.DEFAULT);

    // Add the switch to the row
    row.add_suffix(toggle);
    row.activatable_widget = toggle;

    // Make sure the window doesn't outlive the settings object
    window._settings = settings;
}
```

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
