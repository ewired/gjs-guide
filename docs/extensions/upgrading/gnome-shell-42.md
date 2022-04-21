---
title: Port Extensions to GNOME Shell 42
---
# Port Extensions to GNOME Shell 42

## metadata.json

GNOME Shell 42 added the support for *"session-modes"* in *metadata.json*.

*"session-modes"* value is array of strings with these possible values:

| Value         | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| gdm           | Your extension will be enabled in gdm login screen.                         |
| unlock-dialog | Your extension will be enabled (or stays enabled) in unlock dialog.         |
| user          | Your extension will be enabled (or stays enabled) when unlock is happening. |

For example:

```json
"session-modes":  [ "gdm", "unlock-dialog", "user" ],
```

- *"session-modes"* defaults to *"user"* when it is not presented in *metadata.json*. So you don't need to add *"session-modes"* if you don't need it.

- Only system extensions (located in _/usr/share/gnome-shell/extensions/_) can use *"gdm"* in their session mode.

- Extensions with *"session-modes"* can only pass the EGO reviews if they meet [the review guidelines requirements related to the session modes][session-modes-rg].

## GNOME Shell UI

### OSD Window

OSD window no longer uses `ui.osdWindow.OsdWindowConstraint` and `ui.osdWindow.OsdWindow._relayout()`.

Instead, `ui.osdWindow.OsdWindow` is vertically aligned at the end and `.osd-window` style class is using `margin-bottom` to move it up from the bottom of the screen.

### Panel Corner

`ui.panel.PanelCorner` class and `.panel-corner` style class no longer exist in GNOME Shell 42.

### Popup Menu Section

`ui.popupMenu.PopupMenuSection` is using `.popup-menu-section` style class and you can use it to modify the popup menu section look.

### Screenshot

GNOME Shell 42 ships with built-in screenshot tool. You can find it in `ui.screenshot.ScreenshotUI`.

There are two screenshot modes (`ui.screenshot.UIMode`):

- *SCREENSHOT* to take a picture from screen.
- *SCREENCAST* to capture video from screen.

These are style class names used in Screenshot UI:

- `.screenshot-ui-area-selector`
- `.screenshot-ui-capture-button-circle`
- `.screenshot-ui-close-button`
- `.screenshot-ui-panel` (Wrapper for the controls at the bottom of the screen)
- `.screenshot-ui-screencast-area-indicator`
- `.screenshot-ui-screen-screenshot` (UI wrapper)
- `.screenshot-ui-screen-selector`
- `.screenshot-ui-shot-cast-button`
- `.screenshot-ui-shot-cast-container`
- `.screenshot-ui-tooltip`
- `.screenshot-ui-type-button`
- `.screenshot-ui-type-button-container`
- `.screenshot-ui-window-selector`

| Type                     | Where                                       |
| ------------------------ | ------------------------------------------- |
| Direct Access            | `ui.main.screenshotUI`                      |
| Created In               | `ui.main._initializeUI()`                   |
| Direct Access (UI Group) | `ui.main.layoutManager.screenshotUIGroup`   |
| Created In (UI Group)    | `ui.screenshot.ScreenshotUI`                |

Since there is a screen cast mode, we have new _screen recording indicator_ in panel (`ui.status.remoteAccess.ScreenRecordingIndicator`).
This element only shows up while the screenshot is recording.

| Type                     | Where                                      |
| ------------------------ | ------------------------------------------ |
| Direct Access            | `ui.main.panel.statusArea.screenRecording` |

### Window Menu

Window menu added a new menu item for screenshot and you can find it in `ui.main.windowMenu.WindowMenu`.

### Workspace Switcher Popup

Workspace switcher popup (`ui.workspaceSwitcherPopup.WorkspaceSwitcherPopup`) has been revamped and these style class names no longer exist:

- `.workspace-switcher-group`
- `.workspace-switcher-container`
- `.ws-switcher-active-up`
- `.ws-switcher-active-down`
- `.ws-switcher-active-left`
- `.ws-switcher-active-right`
- `.ws-switcher-box`

Just like _osd window_ it is vertically aligned at the end and `.workspace-switcher` style class is using `margin-bottom` to move it up from the bottom of the screen.

| Type                           | Where                                      |
| ------------------------------ | ------------------------------------------ |
| Style Class                    | `.workspace-switcher`                      |
| Style Class (indicator)        | `.ws-switcher-indicator`                   |
| Style Class (active indicator) | `.ws-switcher-indicator::active`           |

### Color scheme

GNOME Shell 42 supports color scheme for the user interface.

You can find the new gsettings schema id in `org.gnome.desktop.interface.color-scheme` that accepts **default**, **prefer-dark** and **prefer-light**.

`ui.background.BackgroundSource.getBackground()` is using `color-scheme` to get the background.

### Finding Signal Id

GNOME Shell 42 uses `connectObject()` and `disconnectObject()` convenience methods instead of `connect()` and `disconnect()` methods.

You can use [GObject.signal_handler_find()](https://gjs-docs.gnome.org/gobject20~2.66p/gobject.signal_handler_find) to find signal handler id.

For example, we are blocking `overlay-key` signal in `global.display` here:

```js
let signalId = GObject.signal_handler_find(global.display, { signalId: 'overlay-key' });
GObject.signal_handler_block(global.display, signalId);
```

You can simply use `GObject.signal_handler_unblock()` to unblock that signal id:

```js
GObject.signal_handler_unblock(global.display, signalId);
```

## Prefs

GNOME Shell 42 is using `Adw.PreferencesWindow` instead of `Gtk.Window` for extension preferences dialog. It means you can use Libadwaita widgets in your extension preferences window.

### buildPrefsWidget()

Don't worry if you are new to Libadwaita. You can still use your old GTK4 ui without changing anything.

`buildPrefsWidget()` can return three output types _(You can see how these types will be wrapped up)_:

1. `Adw.PreferencesPage`

    ```
    Adw.PreferencesWindow
    └── Adw.PreferencesPage (returned value as Libadwaita Page)
    ```

2. `Adw.PreferencesGroup`

    ```
    Adw.PreferencesWindow
    └── Adw.PreferencesPage
        └── Adw.PreferencesGroup (returned value as Libadwaita Preferences Group)
    ```

3. `Gtk.Widget`

    ```
    Adw.PreferencesWindow
    └── Adw.PreferencesPage
        └── Gtk.Widget (returned value as GTK4 Widget)
    ```

### fillPreferencesWindow()

`fillPreferencesWindow()` is a new function introduced in GNOME Shell 42 and you can use it to fill the preferences window (`Adw.PreferencesWindow`).

- First parameter is `Adw.PreferencesWindow`.
- The return type is `void` (don't need to return anything).
- You should fill the window with at least one page.
- `fillPreferencesWindow()` has higher priority to `buildPrefsWidget()`. It means if you declare both of them in `prefs.js` file, only `fillPreferencesWindow()` will be used.

For example, if you are using a template file like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
  <object class="AdwPreferencesPage" id="my_page">
    <property name="name">my-page</property>
    <property name="title" translatable="yes">My Page</property>
    <property name="icon-name">folder-symbolic</property>
    <child>
      <object class="AdwPreferencesGroup" id="my_group">
        <property name="title" translatable="yes">My Group</property>
        <child>
          <object class="AdwActionRow" id="my_row">
            <property name="title" translatable="yes">My Switch</property>
            <property name="activatable-widget">my_switch</property>
            <child>
              <object class="GtkSwitch" id="my_switch">
                <property name="valign">center</property>
              </object>
            </child>
          </object>
        </child>
      </object>
    </child>
  </object>
</interface>
```

You can add `my_page` to the preferences window like this:

```js
const {Gtk} = imports.gi;

function fillPreferencesWindow(window) {
    let builder = Gtk.Builder.new();
    builder.add_from_file('PATH_TO_THE_TEMPLATE_FILE');
    let page = builder.get_object('my_page');
    window.add(page);
}
```

You can also import Libadwaita and use it directly like this:

```js
const {Adw} = imports.gi;

function fillPreferencesWindow(window) {
    let page1 = Adw.PreferencesPage.new();
    page1.set_title('First Page');
    page1.set_name('first-page');
    page1.set_icon_name('folder-symbolic');

    let group1 = Adw.PreferencesGroup.new();
    group1.set_title('Group in first page');
    page1.add(group1);

    let page2 = Adw.PreferencesPage.new();
    page2.set_title('Second Page');
    page2.set_name('second-page');
    page2.set_icon_name('folder-pictures-symbolic');

    let group2 = Adw.PreferencesGroup.new();
    group2.set_title('Group in second page');
    page2.add(group2);

    window.add(page1);
    window.add(page2);
}
```

You can learn about Libadwaita's widgets in [gjs-docs.gnome.org/adw1](https://gjs-docs.gnome.org/adw1/).

### Test Preferences Window in Dark and Light mode

While you opened and focused on preferences window:

- Press _Ctrl+Shift+I_ or _Ctrl+Shift+D_ to open interactive debugging window.
- Go to _Adwaita_ tab.
- Change _Preferred Color Scheme_.

You need to set **enable-inspector-keybinding** to **true** if the keybinding doesn't work:

```bash
gsettings set org.gtk.Settings.Debug enable-inspector-keybinding true
```

### Resize Preferences Window

Preferences window no longer has a default size. `Adw.PreferencesWindow` can set the appropriate size by default.

Also `fillPreferencesWindow()` allows you to have access to the preferences window and you can resize it with `set_default_size()`:

```js
function fillPreferencesWindow(window) {
    window.set_default_size(800, 600);
    // ...
}
```

### Enable Search in Preferences Window

Libadwaita has built-in search feature that you can use in preferences window and it can search through **title** and **subtitle** of `Adw.PreferencesRow`.

Search feature is disabled by default but you can enable it in preferences window with `search-enabled` property if you want:

```js
function fillPreferencesWindow(window) {
    window.search_enabled = true;
    // ...
}
```

### Header Bar

`Gtk.window_get_titlebar()` and `Gtk.window_set_titlebar()` are not supported in Libadwaita.


### Gtk.ScrolledWindow

`Adw.PreferencesPage` has buit-in `Gtk.ScrolledWindow`. If you are using `Gtk.ScrolledWindow` in your preferences window, remove it.

[session-modes-rg]: https://gjs.guide/extensions/review-guidelines/review-guidelines.html#session-modes
