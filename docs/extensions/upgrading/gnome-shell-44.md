---
title: Port Extensions to GNOME Shell 44
---
# Port Extensions to GNOME Shell 44

## Gsettings Schema

GNOME Shell 44 can compile the GSettings Schemas file(s) while installing the extension package.

In case you are using your own GSettings Schemas, you **MUST** only include the `schemas/org.gnome.shell.extensions.<schema-id>.gschema.xml` file(s) and avoid shipping the `gschemas.compiled` in the package (if your extension is only supporting GNOME Shell 44 and later).

## Background Apps

[ui.status.backgroundApps](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/status/backgroundApps.js) is a new section in quick settings that can show list of the apps running in the background (while the actual window is closed).

[BackgroundAppMenuItem](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/732d0980d890e3c4fa6cda520c63bab9532c4237/js/ui/status/backgroundApps.js#L19) will be used for each item in the list.
Each item has a close button that can quit the app via D-Bus or sending SIGKILL to the process (in case the D-Bus quit fails).

| Type                            | Where                                                    |
| ------------------------------- | -------------------------------------------------------- |
| Direct Access                   | `ui.main.panel.statusArea.quickSettings._backgroundApps` |
| Created In                      | `ui.panel.QuickSettings._init()`                         |
| Style class                     | `.background-apps-quick-toggle`                          |
| Style class (item)              | `.background-app-item`                                   |
| Style class (item close button) | `.background-app-item .close-button`                     |

## QuickToggle and QuickMenuToggle

Use of `label` for `QuickToggle` and `QuickMenuToggle` is deprecated in favour of `title` and will print a warning when accessed. Additionally, it can not be used as a construct property:

```js
// GNOME 43
const toggle43 = new QuickToggle({ label: 'Feature' });

// GNOME 44
const toggle44 = new QuickToggle({ title: 'Feature' });

// GNOME 43 & 44
const toggle = new QuickToggle();
toggle.label = 'Feature';
```

In addition to title, there is new `subtitle` property that you can use for showing sub title.

GNOME Shell 44 features a new *Background Apps* menu in the quick settings menu,
which looks different from other quick settings tiles. If you want your toggle
above the *Background Apps* menu, you can move it after adding it with the
built-in function:

```js
const QuickSettingsMenu = imports.ui.main.panel.statusArea.quickSettings;

function addQuickSettingsItems(items) {
    // Add the items with the built-in function
    QuickSettingsMenu._addItems(items);

    // Ensure the tile(s) are above the background apps menu
    for (const item of items) {
        QuickSettingsMenu.menu._grid.set_child_below_sibling(item,
            QuickSettingsMenu._backgroundApps.quickSettingsItems[0]);
    }
}
```

## Unlock dialog

GNOME Shell 44 changed the blur values for unlock dialog (`ui.unlockDialog`):

| Type              | Old Value | New Value |
| ----------------- | --------- | --------- |
| `BLUR_BRIGHTNESS` | 0.55      | 0.65      |
| `BLUR_SIGMA`      | 60        | 45        |

Also, the _switch user button_ is using different style class:

| Old Style Class                                   | New Style Class                           |
| ------------------------------------------------- | ----------------------------------------- |
| `.modal-dialog-button.switch-user-button .button` | `.login-dialog-button.switch-user-button` |

## Gtk.IconTheme

If you are using `Gtk.IconTheme` in _extension.js_ you should use [`St.IconTheme`](https://gjs-docs.gnome.org/st12~12/st.icontheme) instead.

For example:

```js
const {St} = imports.gi;

const iconTheme = new St.IconTheme();
if (!iconTheme.get_search_path().includes(ICONS_FOLDER_PATH)) {
    iconTheme.append_search_path(ICONS_FOLDER_PATH);
}
iconTheme.rescan_if_needed();
```

## Meta.later_add and Meta.later_remove

`Meta.later_add` and `Meta.later_remove` are now `Meta.Laters.add` and `Meta.Laters.remove`, respectively. Refer to [Meta.Laters](https://gjs-docs.gnome.org/meta12~12/meta.laters).

You can get the `Meta.Laters` from compositor with:

```js
const laters = global.compositor.get_laters();
```

