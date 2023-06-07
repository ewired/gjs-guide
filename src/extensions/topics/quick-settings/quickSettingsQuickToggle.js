const {Gio, GObject} = imports.gi;

const QuickSettings = imports.ui.quickSettings;


const FeatureToggle = GObject.registerClass(
class FeatureToggle extends QuickSettings.QuickToggle {
    _init() {
        super._init({
            title: 'Feature Name',
            iconName: 'selection-mode-symbolic',
            toggleMode: true,
        });

        // NOTE: In GNOME 44, the `label` property must be set after
        // construction. The newer `title` property can be set at construction.
        this.label = 'Feature Name';

        // Binding the toggle to a GSettings key
        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.shell.extensions.example',
        });

        this._settings.bind('feature-enabled',
            this, 'checked',
            Gio.SettingsBindFlags.DEFAULT);
    }
});
