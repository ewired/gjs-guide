---
title: Creating
---

# Creating

To get clean view of how your extension functions, you should restart GNOME Shell after making changes to the code. For this reason, most extension development happens in Xorg/X11 sessions rather than Wayland, which requires you to logout and login to restart .

To restart GNOME Shell in X11, pressing `Alt`+`F2` to open the *Run Dialog* and enter `restart` (or just `r`).

To run new extensions on Wayland you can run a nested gnome-shell using `dbus-run-session -- gnome-shell --nested --wayland`.

- [GNOME Extensions Tool](#gnome-extensions-tool)
- [Manual Creation](#manual-creation)
- [Enabling the Extension](#enabling-the-extension)
- [A Working Extension](#a-working-extension)

## GNOME Extensions Tool

GNOME Shell ships with a program you can use to create a skeleton extension by running `gnome-extensions create`.

Instead of passing options on the command line, you can start creating an extension interactively:

```sh
$ gnome-extensions create --interactive
```

1. **First choose a name:**

   ```sh
   Name should be a very short (ideally descriptive) string.
   Examples are: “Click To Focus”, “Adblock”, “Shell Window Shrinker”
   Name: Example Extension
   ```

2. **Second choose a description:**

   ```sh
   Description is a single-sentence explanation of what your extension does.
   Examples are: “Make windows visible on click”, “Block advertisement popups”, “Animate windows shrinking on minimize”
   Description: An extension serving as an example
   ```

3. **The last step is to choose a UUID for your extension:**

   ```sh
   UUID is a globally-unique identifier for your extension.
   This should be in the format of an email address (clicktofocus@janedoe.example.com)
   UUID: example@shell.gnome.org
   ```

The whole process looks like this on the command line:

```sh
$ gnome-extensions create --interactive
Name should be a very short (ideally descriptive) string.
Examples are: “Click To Focus”, “Adblock”, “Shell Window Shrinker”
Name: Example Extension
Description is a single-sentence explanation of what your extension does.
Examples are: “Make windows visible on click”, “Block advertisement popups”, “Animate windows shrinking on minimize”
Description: An extension serving as an example            
UUID is a globally-unique identifier for your extension.
This should be in the format of an email address (clicktofocus@janedoe.example.com)
UUID: example@shell.gnome.org
```

Once you finish the last step, the extension template will be created and opened in an editor:

<img :src="$withBase('/assets/img/gnome-extensions-create-editor.png')" />


## Manual Creation

Start by creating an extension directory, then open the two required files in `gedit` or another editor:

```sh
$ mkdir -p ~/.local/share/gnome-shell/extensions/example@shell.gnome.org
$ cd ~/.local/share/gnome-shell/extensions/example@shell.gnome.org
$ gedit extension.js metadata.json &
```

Populate `extension.js` and `metadata.json` with the basic requirements, remembering that `uuid` MUST match the directory name of your extension:

### `metadata.json`
```js
{
    "uuid": "example@shell.gnome.org",
    "name": "Example",
    "description": "This extension puts an icon in the panel with a simple dropdown menu.",
    "version": 1,
    "shell-version": [ "42" ],
    "url": "https://gitlab.gnome.org/World/ShellExtensions/gnome-shell-extension-example"
}
```

### `extension.js`

Notice that in the example below, we are using three top-level functions instead of class like in the example above.

```js
'use strict';

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

## Enabling the Extension

Firstly, we want to ensure we're watching the journal for any errors or mistakes we might have made. As described in the [Debugging](../development/debugging.html) page, most users can run `journalctl` in a terminal to watch the output of GNOME Shell and extensions:

```sh
$ journalctl -f -o cat /usr/bin/gnome-shell
```

Next we'll enable the extension using `gnome-extensions enable`:

```sh
$ gnome-extensions enable example@shell.gnome.org
```

To get clean view of how your extension functions after making changes, you should either restart GNOME Shell or run a nested session.

- **X11**
  In X11 sessions, you can restart GNOME Shell by pressing `Alt`+`F2` to open the *Run Dialog* and then enter `restart` (or just `r`).
  
- **Wayland**
  On Wayland, the easiest way to test the new extension is by running a nested gnome-shell:

  ```sh
  dbus-run-session -- gnome-shell --nested --wayland
  ```

After this is done you should see something like the following in the log:

```sh
GNOME Shell started at Sat Aug 22 2020 07:14:35 GMT-0800 (PST)
initializing Example Extension version 1
enabling Example Extension version 1
```

## A Working Extension

As a simple example, let's add a panel button to show what a working extension might look like:

```js
const St = imports.gi.St;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


class Extension {
    constructor() {
        this._indicator = null;
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

        // `Main.panel` is the actual panel you see at the top of the screen,
        // not a class constructor.
        Main.panel.addToStatusArea(indicatorName, this._indicator);
    }
    
    // REMINDER: It's required for extensions to clean up after themselves when
    // they are disabled. This is required for approval during review!
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

Now save `extension.js` and reload the extension see the button in the panel.
