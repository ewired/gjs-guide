---
title: Port Extensions to GNOME Shell 43
---
# Port Extensions to GNOME Shell 43

## Quick Settings

GNOME Shell 43 removed `aggregateMenu` and uses quick settings instead:

| Type                      | Where                                 |
| ------------------------- | ------------------------------------- |
| Direct access             | `Main.panel.statusArea.quickSettings` |
| Columns count             | `ui.panel.N_QUICK_SETTINGS_COLUMNS`   |
| Panel menu button         | `ui.panel.QuickSettings`              |

[ui.quickSettings][ggo-quick-settings] is a new module for:

| Name                      | Use Case                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| QuickToggle               | The primary entry point to create toggle button.                                                                                     |
| QuickMenuToggle           | Same as _QuickToggle_ but with menu.                                                                                                 |
| QuickSlider               | To create slider like brightness and volume control (that are already built-in).                                                     |
| QuickSettingsMenu         | To add another quick settings menu instead of adding items to the existing `Main.panel.statusArea.quickSettings`.                    |

Learn how to implement quick settings with [examples][quick-settings].

## Screen Sharing Indicator

GNOME Shell 43 also have a new screen sharing indicator in panel:

| Type                      | Where                                 |
| ------------------------- | ------------------------------------- |
| Direct access             | `Main.panel.statusArea.screenSharing` |

## App display

App display have new `AppGrid` and `BaseAppViewGridLayout` class.

The grid layout allows you to manage the layout such as going to another page
and toggling the page indicators visibility.

## Signals

In GNOME Shell 43, instead of using `Signals.addSignalMethods()`,
you can extend your class to `Signals.EventEmitter`.

To do that, you need to use [misc.signals][misc-signals] module:

```js
const Signals = imports.misc.signals;

var MyClass = class extends Signals.EventEmitter {
    constructor() {
        super();
    }
}
```

[ggo-quick-settings]: https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/quickSettings.js
[quick-settings]: ../topics/quick-settings.html
[misc-signals]: https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/misc/signals.js

