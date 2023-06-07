---
title: Targeting Older GNOME Versions
---

# Targeting Older GNOME Versions

GNOME's code evolves between each release, and extensions using this code need to be updated accordingly. While easier to support only one GNOME version in an extension, it is possible to also support older GNOME versions within the same code base.

## Declaring Support

In your `metadata.json` file, add all the GNOME Shell versions you support in the `shell-version` field. Learn more in the [Anatomy of an Extension `shell-version` section][anatomy-shell-version].

```json
{
    "shell-version": [ "3.36", "3.38", "40", "41", "42" ]
}
```

## Adapting to Different Code

### Feature Detection

You can test if a method exists before using it:

```js
if (method)
    method();
else
    // Use another method, write a replacement, or do nothing
```

Or using `try...catch`:

```js
try {
    method();
} catch (e) {
    // Use another method, write a replacement, or do nothing
}
```

### Version Number Detection

If you know when a feature was introduced or a part of the code updated, you can
adapt to these changes by targeting specific version numbers. It is possible to
browse older code on the [Shell's GitLab page][shell-gitlab] by changing the
tag.

Prior to version 40, GNOME Shell used 3.xx version numbers, even minor number
denoting a stable release.

@[code js](@src/extensions/development/targeting-older-gnome/shellVersionCheck.js)

## Preferences

### GTK Version

Starting from GNOME 40, the preferences dialog uses GTK4, while older versions
use GTK3. There has been some changes between the two versions, please refer to
the [GTK4 migration guide][gtk4-migration] for an overview.

If you need different code, it is possible to check the current GTK version:

@[code js](@src/extensions/development/targeting-older-gnome/gtkVersionCheck.js)

### `buildPrefsWidget()`

Prior to version 42, the `prefs.js` needed a `buildPrefsWidget` function,
returning a `GtkWidget` to be inserted in the preferences dialog.

```js
function buildPrefsWidget() {
    return new Gtk.Label({ title: 'My extension preferences' });
}
```

It is still possible to use this function in the current version of GNOME. The
`fillPreferencesWindow` function will have priority, so you can have different
widgets for versions older than 42. Useful if you want to use Libadwaita widgets
on current versions, and only GTK widgets on older versions.

[anatomy-shell-version]: ../overview/anatomy.md#shell-version

[gtk4-migration]: https://docs.gtk.org/gtk4/migrating-3to4.html
[shell-gitlab]: https://gitlab.gnome.org/GNOME/gnome-shell
