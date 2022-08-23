---
title: Quick Settings
---

# Quick Settings

Quick settings is a new user-interface pattern for the GNOME Shell
[System Menu][systemmenu], available in GNOME 43 and later.

This provides a simple, but flexible method that extensions can use to add
indicators, toggles and entry points for settings to the System Menu.

[shell-systemmenu]: https://help.gnome.org/users/gnome-help/stable/shell-introduction.html#systemmenu


## Example Usage

This page will demonstrate a few simple examples of how quick settings can be
used in extensions. There are many complete examples of this UI pattern in GNOME
Shell, which can be referenced in the [`js/ui/status/`][gs-status] directory.

[gs-status]: https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/main/js/ui/status


### Basic Toggle

Here is an example of a simple on/off toggle, similar to what the Night Light
uses in GNOME Shell:

```js
const {Gio, GObject} = imports.gi;

const QuickSettings = imports.ui.quickSettings;


const FeatureToggle = GObject.registerClass(
class FeatureToggle extends QuickSettings.QuickToggle {
    _init() {
        super._init({
            label: 'Feature Name',
            iconName: 'selection-mode-symbolic',
            toggleMode: true,
        });

        // Binding the toggle to a GSettings key
        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.gnome.shell.extensions.example',
        });

        this._settings.bind('feature-enabled',
            this, 'checked',
            Gio.SettingsBindFlags.DEFAULT);
    }
});
```

You may also want your extension to show a panel indicator when the feature is
enabled. The [`QuickSettings.SystemIndicator`][gs-systemindicator] class is used
to display an icon and also manages quick setting items:

```js
const {Gio, GObject} = imports.gi;

const QuickSettings = imports.ui.quickSettings;

// This is the live instance of the Quick Settings menu
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;


const FeatureIndicator = GObject.registerClass(
class FeatureIndicator extends QuickSettings.SystemIndicator {
    _init() {
        super._init();

        // Create the icon for the indicator
        this._indicator = this._addIndicator();
        this._indicator.icon_name = 'selection-mode-symbolic';

        // Showing the indicator when the feature is enabled
        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.gnome.shell.extensions.example',
        });

        this._settings.bind('feature-enabled',
            this._indicator, 'visible',
            Gio.SettingsBindFlags.DEFAULT);
        
        // Create the toggle and associate it with the indicator, being sure to
        // destroy it along with the indicator
        this.quickSettingsItems.push(new FeatureToggle());
        
        this.connect('destroy', () => {
            this.quickSettingsItems.forEach(item => item.destroy());
        });
        
        // Add the indicator to the panel and the toggle to the menu
        QuickSettingsMenu._indicators.add_child(this);
        QuickSettingsMenu._addItems(this.quickSettingsItems);
    }
});
```

Since the code for adding the indicator and toggle item is contained in the
`FeatureIndicator` class, the code for the extension is quite simple:

```js
class Extension {
    constructor() {
        this._indicator = null;
    }
    
    enable() {
        this._indicator = new FeatureIndicator();
    }
    
    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}
```

[gs-quicksettings]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/quickSettings.js


### Toggle Menu

For features with a few more settings or options, you may want to add a submenu
to the toggle. The [`QuickSettings.QuickMenuToggle`][gs-quicksettings] includes
a built-in [Popup Menu][popupmenu], that supports the standard menu functions:

```js
const {Gio, GObject, St} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();

const Main = imports.ui.Main;
const PopupMenu = imports.ui.popupMenu;
const QuickSettings = imports.ui.quickSettings;


const FeatureMenuToggle = GObject.registerClass(
class FeatureMenuToggle extends QuickSettings.QuickMenuToggle {
    _init() {
        super._init({
            label: 'Feature Name',
            iconName: 'selection-mode-symbolic',
            toggleMode: true,
        });
        
        // This function is unique to this class. It adds a nice header with an
        // icon, title and optional subtitle. It's recommended you do so for
        // consistency with other menus.
        this.menu.setHeader('selection-mode-symbolic', 'Feature Header',
            'Optional Subtitle');
        
        // You may also add sections of items to the menu
        this._itemsSection = new PopupMenu.PopupMenuSection();
        this._itemsSection.addAction('Option 1', () => log('activated'));
        this._itemsSection.addAction('Option 2', () => log('activated'));
        this.menu.addMenuItem(this._itemsSection);

        // Add an entry-point for more settings
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        const settingsItem = this.menu.addAction('More Settings',
            () => ExtensionUtils.openPrefs());
            
        // Ensure the settings are unavailable when the screen is locked
        settingsItem.visible = Main.sessionMode.allowSettings;
        this.menu._settingsActions[Extension.uuid] = settingsItem;
    }
});
```

The toggle menu can be added just like a simple toggle:

```js
const {Gio, GObject} = imports.gi;

const QuickSettings = imports.ui.quickSettings;

// This is the live instance of the Quick Settings menu
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;


const FeatureIndicator = GObject.registerClass(
class FeatureIndicator extends QuickSettings.SystemIndicator {
    _init() {
        super._init();

        // Create the icon for the indicator
        this._indicator = this._addIndicator();
        this._indicator.icon_name = 'selection-mode-symbolic';

        // Create the toggle menu and associate it with the indicator, being
        // sure to destroy it along with the indicator
        this.quickSettingsItems.push(new FeatureMenuToggle());
        
        this.connect('destroy', () => {
            this.quickSettingsItems.forEach(item => item.destroy());
        });
        
        // Add the indicator to the panel and the toggle to the menu
        QuickSettingsMenu._indicators.add_child(this);
        QuickSettingsMenu._addItems(this.quickSettingsItems);
    }
});
```

[popupmenu]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/popupMenu.js

