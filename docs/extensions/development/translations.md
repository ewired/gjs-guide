---
title: Translations
---
# Translations

[Gettext][gettext] is a localization framework for writing multi-lingual applications that can also be used in GNOME Shell extensions.

Preparing your extension for Gettext allows your users to contribute localized translations. More information and guides to translating can be found on the [GNOME Translation Project](https://wiki.gnome.org/TranslationProject) wiki.

- [Preparing an Extension](#preparing-an-extension)
- [Initializing Translations](#initializing-translations)
- [Marking Strings for Translation](#marking-strings-for-translation)
- [Packing an Extension with Translations](#packing-an-extension-with-translations)
  
  
## Preparing an Extension

Start by creating a `po` directory for the translation template and translated languages:

```sh
$ cd ~/.local/share/gnome-shell/extensions
$ mkdir example@shell.gnome.org/po
```

## Initializing Translations

Your extension must be configured to initialize translations when it's loaded. This only has to be done once, so the `init()` function in `extension.js` (and `prefs.js`) is the perfect place to do this:

```js
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
    // ExtensionUtils has a convenient function for doing this
    ExtensionUtils.initTranslations(Me.metadata.uuid);
    
    return new Extension();
}
```

## Marking Strings for Translation

You also need to tell Gettext what strings need to be translated. Gettext functions retrieve the translation during run-time, but also mark strings as translatable for the scanner.

* **`gettext()`**

  This function is the most commonly used function, and is passed a single string.

* **`ngettext()`**

  This function is the other function you are likely to use, and is meant for strings that may or may not be plural like *"1 Apple"* and *"2 Apples"*.

  The `format()` function (see [`printf`][printf]) is available for all strings, but should only be used with `ngettext()`. In all other cases you should use JavaScript's [Template Literals][template-literals].

```js
const Gettext = imports.gettext;
const St = imports.gi.St;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


// This creates an object with functions for marking strings as translatable.
// You must pass the same domain as `ExtensionUtils.initTranslations()`.
const Domain = Gettext.domain(Me.metadata.uuid);

// These are the two most commonly used Gettext functions. The `gettext()`
// function is often aliased as `_()`
const _ = Domain.gettext;
const ngettext = Domain.ngettext;


class Extension {
    constructor() {
        this._indicator = null;
        this._count = 0;
    }
    
    _showNotification() {
        this._count += 1;
        
        // A regular translatable string is marked with the `_()` function
        let title = _('A Notification');
        
        // A "countable" string is marked with the `ngettext()` function
        let body = ngettext(
            'You have been notified %d time',
            'You have been notified %d times',
            this._count
        ).format(this._count);
        
        Main.notify(title, body);
    }
    
    enable() {
        let indicatorName = `${Me.metadata.name} Indicator`;
        
        // Create a panel button
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        
        // Add an icon
        let icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon'
        });
        this._indicator.add_child(icon);
        
        // Add a menu item that shows a notification.
        this._indicator.menu.addAction(
            _('Show Notification'),
            this._showNotification.bind(this)
        );

        // Add the indicator to the panel
        Main.panel.addToStatusArea(indicatorName, this._indicator);
    }
    
    disable() {
        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
    }
}


function init() {
    log(`initializing ${Me.metadata.name}`);
    
    // ExtensionUtils has a convenient function for doing this
    ExtensionUtils.initTranslations(Me.metadata.uuid);
    
    return new Extension();
}
```


## Scanning for Translatable Strings

Gettext uses a POT file (portable object template) to store a list of all the translatable strings. You can generate the POT file by scanning your extension's source code with `xgettext`:

```sh
$ cd ~/.local/share/gnome-shell/extensions/example@shell.gnome.org
$ xgettext --from-code=UTF-8 --output=po/example.pot *.js
```

Translators can use the `.pot` file to create a `.po` file translated for their language with a program like [Gtranslator][gtranslator] or [POEdit][poedit].

## Packing an Extension with Translations

Using the `gnome-extensions` tool makes it easy to compile and include the translations with your extension. Simply pass the relative directory `po` to the `--podir` option when packing your extension:

```sh
$ gnome-extensions pack --podir=po example@shell.gnome.org
```


[gettext]: https://en.wikipedia.org/wiki/Gettext
[format-module]: https://gitlab.gnome.org/GNOME/gjs/blob/master/doc/Modules.md#format
[printf]: https://wikipedia.org/wiki/Printf_format_string
[template-literals]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals

[gtranslator]: https://flathub.org/apps/details/org.gnome.Gtranslator
[poedit]: https://flathub.org/apps/details/net.poedit.Poedit

