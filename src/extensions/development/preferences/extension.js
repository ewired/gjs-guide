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
