---
title: Quick Settings
---

# Quick Settings

Quick settings is a new user-interface pattern for the GNOME Shell
[System Menu][shell-systemmenu], available in GNOME 43 and later.

This provides a simple, but flexible method that extensions can use to add
indicators, toggles and entry points for settings to the System Menu.

[shell-systemmenu]: https://help.gnome.org/users/gnome-help/stable/shell-introduction.html#systemmenu


## Example Usage

This page will demonstrate a few simple examples of how quick settings can be
used in extensions. There are many complete examples of this UI pattern in GNOME
Shell, which can be referenced in the [`js/ui/status/`][gs-status] directory.

[gs-status]: https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/main/js/ui/status


### Basic Toggle

::: warning
Note that in GNOME 44, the `label` property was renamed to `title`. The `label`
property will continue to work, except as a construct property.
:::

Here is an example of a simple on/off toggle, similar to what the Night Light
uses in GNOME Shell:

@[code js](@src/extensions/topics/quick-settings/quickSettingsQuickToggle.js)

You may also want your extension to show a panel indicator when the feature is
enabled. The [`QuickSettings.SystemIndicator`][js-systemindicator] class is used
to display an icon and also manages quick setting items:

@[code js](@src/extensions/topics/quick-settings/quickSettingsSystemIndicator.js)

Since the code for adding the indicator and toggle item is contained in the
`FeatureIndicator` class, the code for the extension is quite simple:

@[code js](@src/extensions/topics/quick-settings/extension.js)

[js-systemindicator]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/quickSettings.js


### Toggle Menu

::: warning
Note that in GNOME 44, the `label` property was renamed to `title`. The `label`
property will continue to work, except as a construct property.
:::

For features with a few more settings or options, you may want to add a submenu
to the toggle. The [`QuickSettings.QuickMenuToggle`][js-quickmenutoggle]
includes a built-in [Popup Menu](popup-menu.md), that supports the standard menu
functions:

@[code js](@src/extensions/topics/quick-settings/quickSettingsQuickMenuToggle.js)

[js-quickmenutoggle]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/quickSettings.js


### Slider

The quick settings API also comes with a new class for sliders, for settings
like brightness or volume. The [`QuickSettings.QuickSlider`][js-quickslider]
class is fairly straight forward to use:

@[code js](@src/extensions/topics/quick-settings/quickSettingsQuickSlider.js)

When adding the slider to the menu, you will usually want it to span two
columns, like the default volume slider:

```js
// Add the slider to the menu, this time passing `2` as the second
// argument to ensure the slider spans both columns of the menu
QuickSettingsMenu._addItems([new FeatureSlider()], 2);
```

[js-quickslider]: https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/quickSettings.js


### Action Button

It's also possible to add action buttons to the top of the quick settings, such
as the *Lock Screen* or *Settings* button. Note that this is a very prominent
location in the UI with limited space, so you should consider carefully before
adding more buttons here.

@[code js](@src/extensions/quick-settings/quickSettingsActionButton.js)

## Extra Tips

### Menu Placement

GNOME Shell 44 features a new *Background Apps* menu in the quick settings menu,
which looks different from the other tiles. If you want your toggle placed above
the *Background Apps* menu (or any other widget), you can move it after adding
it with the built-in function:

@[code js](@src/extensions/topics/quick-settings/quickSettingsMenuPlacement.js)
