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
        if (session.currentMode === 'user' || session.parentMode === 'user') {
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
