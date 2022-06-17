---
title: Creating
---

# Creating

This page will guide you through creating a new GNOME Shell extension. If this is your first extension, you will probably want to use the `gnome-extensions` tool.

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

Depending on whether you are running an X11 session or a Wayland session, we will prepare a simple debugging environment. For more information about debugging GNOME Shell extensions, see the [Debugging](debugging.html) page.

For either session type, start by opening a new terminal, such as GNOME Terminal or GNOME Console.

- **X11 Sessions**

    Start by executing the following command, which will monitor the output of GNOME Shell:

    ```sh
    $ journalctl -f -o cat /usr/bin/gnome-shell
    ```
    
    Then press `Alt`+`F2` to open the *Run a Command* dialog, then run the built-in command `restart` to have GNOME Shell load your extension.
    
- **Wayland Sessions**

    Execute the following command, which will start a nested instance of GNOME Shell:

    ```sh
    dbus-run-session -- gnome-shell --nested --wayland
    ```
    
    Once the new process start, any output from the nested session will be printed in the same terminal.

Now that you're prepared to debug any problems with your extension, use the `gnome-extensions` tool to enable your extension by running the following command:

```sh
$ gnome-extensions enable example@shell.gnome.org
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
