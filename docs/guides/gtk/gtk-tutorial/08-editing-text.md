---
title: Editing Text
---

# Editing Text

There are two primary widgets that allow the user to edit text in GTK+: `Gtk.Entry` and `Gtk.TextView`. While they are quite similar the general rule is `Gtk.Entry` is built for short, simple text input while `Gtk.TextView` is built for multi-line or formatted text.

## Buffers

Both `Gtk.Entry` and `Gtk.TextView` rely on *buffers* to store their text for them. A buffer is an object that stores and manages text for a widget. `Gtk.Entry` uses `Gtk.EntryBuffer` while `Gtk.TextView` uses `Gtk.TextBuffer`. You must pass a new buffer to the `buffer` property when creating a `Gtk.Entry` or a `Gtk.TextView`.

## `Gtk.Entry`

`Gtk.Entry` is a simple, one-line text field that allows the user to enter short amounts of data.


```js
#!/usr/bin/gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

const entry = new Gtk.Entry({
    buffer: new Gtk.EntryBuffer()
});

box.add(entry);

const button = new Gtk.Button({
    label: 'Enter'
});

button.connect('clicked', () => {
    log('Entered in the entry: ' + entry.get_buffer().text);
});

box.add(button);

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(box);
win.show_all();

Gtk.main();
```

## `Gtk.TextView`

`Gtk.TextView` is a multi-line text field that allows the user to enter long amounts of data with formatting if desired.

```js
#!/usr/bin/gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

const entry = new Gtk.TextView({
    buffer: new Gtk.TextBuffer(),
    vexpand: true
});

box.add(entry);

const button = new Gtk.Button({
    label: 'Enter'
});

button.connect('clicked', () => {
    log('Entered in the text view: ' + entry.get_buffer().text);
});

box.add(button);

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(box);
win.show_all();

Gtk.main();
```