---
title: Preferences
---

# Preferences

Our preferences dialog will be written in [Gtk][gtk], which gives us a lot of options for how we present settings to the user. You may consider looking through the GNOME Human Interface Guidelines for ideas or guidance.

- [GSettings](#gsettings)
  - [Creating the Schema](#creating-the-schema)
  - [Compiling the Schema](#compiling-the-schema)
  - [Integrating GSettings](#integrating-gsettings)
- [Preferences Window](#preferences-window)

## GSettings

[GSettings][gsettings] provides a simple, extremely fast API for storing application settings, that can also be used by GNOME Shell extensions.

### Creating the schema

Schema files describe the types and default values of a particular group of settings, using the same type format as [GVariant][gvariant-format]. The first thing to do is create a subdirectory for your settings schema and open the schema file in your editor:

```sh
$ mkdir schemas/
$ gedit schemas/org.gnome.shell.extensions.example.gschema.xml
```

Then using your edit, create a schema describing the settings for your extension:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<schemalist>
  <schema id="org.gnome.shell.extensions.example" path="/org/gnome/shell/extensions/example/">
    <!-- See also: https://developer.gnome.org/glib/stable/gvariant-format-strings.html -->
    <key name="show-indicator" type="b">
      <default>true</default>
    </key>
  </schema>
</schemalist>
```

In the case of GSchema IDs, it is convention to use the above `id` and `path` form so that all GSettings for extensions can be found in a common place.

### Compiling the schema

Once you are done defining you schema, you must compile it before it can be used:

```sh
$ glib-compile-schemas schemas/
$ ls schemas
example.gschema.xml  gschemas.compiled
```

### Integrating GSettings

Now that our GSettings schema is compiled and ready to be used, we'll integrate it into our extension:

```js
const Gio = imports.gi.Gio;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


class Extension {
    constructor() {
        this._indicator = null;
        
        this.settings = ExtensionUtils.getSettings(
            'org.gnome.shell.extensions.example');
    }
    
    enable() {
        log(`enabling ${Me.metadata.name}`);

        let indicatorName = `${Me.metadata.name} Indicator`;
        
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        
        // Add an icon
        let icon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'face-laugh-symbolic'}),
            style_class: 'system-status-icon'
        });
        this._indicator.add_child(icon);

        // Bind our indicator visibility to the GSettings value
        //
        // NOTE: Binding properties only works with GProperties (properties
        // registered on a GObject class), not native JavaScript properties
        this.settings.bind(
            'show-indicator',
            this._indicator,
            'visible',
            Gio.SettingsBindFlags.DEFAULT
        );

        Main.panel.addToStatusArea(indicatorName, this._indicator);
    }
    
    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);
    
    return new Extension();
}
```

Now save `extension.js` and restart GNOME Shell to load the changes to your extension.

## Preferences Window

Now that we have GSettings for our extension, we will give the use some control by creating a simple preference dialog. Start by creating the `prefs.js` file and opening it in your text editor:

```sh
$ gedit prefs.js
```

Then we'll create a simple grid with a title, label and button for resetting our saved settings:

```js
'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function buildPrefsWidget() {

    // Copy the same GSettings code from `extension.js`
    this.settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.example');

    // Create a parent widget that we'll return from this function
    let prefsWidget = new Gtk.Grid({
        margin: 18,
        column_spacing: 12,
        row_spacing: 12,
        visible: true
    });

    // Add a simple title and add it to the prefsWidget
    let title = new Gtk.Label({
        label: `<b>${Me.metadata.name} Preferences</b>`,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    // Create a label & switch for `show-indicator`
    let toggleLabel = new Gtk.Label({
        label: 'Show Extension Indicator:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(toggleLabel, 0, 1, 1, 1);

    let toggle = new Gtk.Switch({
        active: this.settings.get_boolean ('show-indicator'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggle, 1, 1, 1, 1);

    // Bind the switch to the `show-indicator` key
    this.settings.bind(
        'show-indicator',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Return our widget which will be added to the window
    return prefsWidget;
}
```

To test the new preferences dialog, you can launch it directly from the command line:

```sh
$ gnome-extensions prefs example@shell.gnome.org
```

<img :src="$withBase('/assets/img/gnome-extensions-example-prefs.png')" />

The extension should be kept up to date with any changes that happen, because of the binding in `extension.js` watching for changes.


[gsettings]: https://gjs-docs.gnome.org/gio20-settings/
[gvariant-format]: https://developer.gnome.org/glib/stable/gvariant-format-strings.html
[gtk]: https://gjs-docs.gnome.org/gtk30/

