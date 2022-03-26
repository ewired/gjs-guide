---
title: Session Modes
---

# Session Modes

Session modes are environment states of GNOME Shell. For example, when a user is
logged in and using their desktop the Shell is in the `user` mode.

Since GNOME 42, extensions have the option of operating in other session modes,
such as the `unlock-dialog` mode when the screen is locked. For more details,
see the [`session-modes`](/extensions/overview/anatomy.html#session-modes)
documentation.


## Example Usage

Here is an example of a `metadata.json` for an extension that can run in the
regular `user` mode and continue running in the `unlock-dialog` mode, when the
screen is locked.

```js
{
    "uuid": "session-modes-example@gjs.guide",
    "name": "Session Modes Example",
    "description": "This is an example of using session modes in an extension.",
    "shell-version": [ "42" ],
    "session-modes": ["user", "unlock-dialog"],
    "url": "https://gitlab.gnome.org/World/ShellExtensions/session-modes-example",
    "version": 1
}
```

Like standard extensions, the extension will be enabled when the user logs in
and logs out, but won't be disabled when the screen locks.

Extensions that continue running on the lock screen will usually want to disable
UI elements when the session is locked, while continuing to operate in the
background.

```js
const {GLib, St} = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


class Extension {
    constructor() {
        this._indicator = null;
        this._timeoutId = null;
        this._sessionId = null;
    }
    
    _addIndicator() {
        if (this._indicator === null) {
            this._indicator = new PanelMenu.Button(0.0, 'Remindicator', false);
            
            const icon = new St.Icon({
                icon_name: 'preferences-system-time-symbolic',
                style_class: 'system-status-icon',
            });
            this._indicator.add_child(icon);

            Main.panel.addToStatusArea('Remindicator', this._indicator);
        }
    }
    
    _removeIndicator() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
    
    // When the session mode changes, we will either add or remove our indicator
    // so it is not visible on the lock screen.
    _onSessionModeChanged(session) {
        if (session.currentMode === 'user') {
            this._addIndicator();
        } else if (session.currentMode === 'unlock-dialog') {
            this._removeIndicator();
        }
    }
    
    // Our extension will be enabled when the user logs in
    enable() {
        // Watch for changes to the session mode
        this._sessionId = Main.sessionMode.connect('updated',
            this._onSessionModeChanged.bind(this));
        
        // Show a notification every hour
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT,
            60 * 60, () => {
                Main.notify('Reminder', 'An hour has passed!');
                
                return GLib.SOURCE_CONTINUE;
            });
            
        this._addIndicator();
    }
    
    // Our extension will only be disabled when the user logs out
    disable() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }
        
        if (this._sessionId) {
            Main.sessionMode.disconnect(this._sessionId);
            this._sessionId = null;
        }
        
        this._removeIndicator();
    }
}

function init(meta) {
    return new Extension();
}
```

