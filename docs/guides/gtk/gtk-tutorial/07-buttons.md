---
title: Buttons
---

# Buttons

## `Gtk.Button`

`Gtk.Button` is the "base" for all buttons in GNOME. It provides an implementation of a button which can contain either text or imagery.

```js
#!/usr/bin/gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.Button({ label: 'Click Me!' });
button.connect('clicked', () => {
    log('The button was clicked!');
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();
```

## `Gtk.ToggleButton`

`Gtk.ToggleButton` is an extension of `Gtk.Button`. It is visually similar but when first pressed stays depressed or *active* to indicate it has been *toggled*. It takes a second press to *toggle* the button back to *inactive*. `Gtk.ToggleButton` thus has two distinct states: active and inactive.

```js
#!/usr/bin/gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.ToggleButton({ label: 'Toggle Me!' });
button.connect('clicked', () => {
    log(`The button is: ${button.get_active() ? 'active' : 'inactive'}!`);
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();
```

## `Gtk.LinkButton`

`Gtk.LinkButton` extends `Gtk.Button` to provide an easy way to add links to an application. It functions identically to a `Gtk.Button` except instead of running a custom action when clicked it opens the provided link in the user's browser or application of choice.

```js
#!/usr/bin/gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.LinkButton({
    label: 'Open Me!',
    uri: 'https://gnome.org'
});
button.connect('clicked', () => {
    log('Visit me!');
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();
```