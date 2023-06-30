const {Adw, GLib, Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


/**
 * Like `extension.js` this is used for any one-time setup like translations.
 *
 * @param {object} metadata - The metadata.json file, parsed as JSON.
 */
function init(metadata) {
    console.debug(`initializing ${metadata.name} Preferences`);
}


/**
 * This function is called when the preferences window is first created to build
 * and return a GTK widget.
 *
 * As of GNOME 42, the preferences window will be a `Adw.PreferencesWindow`. The
 * widget returned by this function will be added to an `Adw.PreferencesPage` or
 * `Adw.PreferencesGroup` if necessary.
 *
 * @returns {Gtk.Widget} the preferences widget
 */
function buildPrefsWidget() {
    // This may be any GtkWidget, although usually you would choose a container
    // container like a GtkBox, GtkGrid or GtkNotebook
    const prefsWidget = new Gtk.Box();

    // Add a widget to the container, usually a preference row such as
    // AdwActionRow, AdwComboRow or AdwRevealerRow
    const label = new Gtk.Label({ label: `${Me.metadata.name}` });
    prefsWidget.append(label);

    return prefsWidget;
}

/**
 * This function is called when the preferences window is first created to fill
 * the `Adw.PreferencesWindow`.
 *
 * This function will only be called by GNOME 42 and later. If this function is
 * present, `buildPrefsWidget()` will NOT be called.
 *
 * @param {Adw.PreferencesWindow} window - The preferences window
 */
function fillPreferencesWindow(window) {
    const prefsPage = new Adw.PreferencesPage({
        name: 'general',
        title: 'General',
        icon_name: 'dialog-information-symbolic',
    });
    window.add(prefsPage);

    const prefsGroup = new Adw.PreferencesGroup({
        title: 'Appearance',
        description: `Configure the appearance of ${Me.metadata.name}`,
    });
    prefsPage.add(prefsGroup);

    const showIndicatorRow = new Adw.ActionRow({
        title: 'Show Indicator',
        subtitle: 'Whether to show the panel indicator',
    });
    prefsGroup.add(showIndicatorRow);

    const showIndicatorSwitch = new Gtk.Switch();
    showIndicatorRow.add_suffix(showIndicatorSwitch);
    showIndicatorRow.set_activatable_widget(showIndicatorSwitch);
}
