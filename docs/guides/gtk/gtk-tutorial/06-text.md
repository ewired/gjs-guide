---
title: Displaying Text
---

# Displaying Text

::: tip
Read [Strings in GJS](../../gjs/strings.html) before starting this page!
:::

## `Gtk.Label`

In GTK+ the simplest way to display text is using `Gtk.Label`. A `Gtk.Label` can contain simple, standard text or a variety of text styles using Markdown.

## Standard Text

To create a `Gtk.Label` with standard text simply pass the text as a JavaScript string to the `label` property of `Gtk.Label` in the constructor or using `Gtk.Label.prototype.set_label()`.

Here is a simple example:

```js
#!/usr/bin/gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

let label = new Gtk.Label({ label: 'Hello!' });
let win = new Gtk.Window();
win.add(label);
win.show_all();

Gtk.main();
```

## Markup

To use markup you must pass `useMarkup` to the label.

Here is a simple example:

```js
#!/usr/bin/gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

let label = new Gtk.Label({
    useMarkup: true,
    label: '<b>Hello!</b>'
});
let win = new Gtk.Window();
win.add(label);
win.show_all();

Gtk.main();
```

