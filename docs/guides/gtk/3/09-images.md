---
title: Images
---

# Images

## `Gtk.Image`

`Gtk.Image` is a widget which stores images from a variety of sources. It can display from a file, an icon name, or an array of pixels.

### Loading from a File

In this example we've created a simple image viewer.

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

const image = new Gtk.Image({
    vexpand: true
});

box.add(image);

const button = Gtk.FileChooserButton.new('Pick An Image', Gtk.FileChooserAction.OPEN);

button.connect('file-set', () => {
    const fileName = button.get_filename();
    image.set_from_file(fileName);
});

box.add(button);

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(box);
win.show_all();

Gtk.main();
```

### Loading from an Icon Name & Adding an image to a `Gtk.Button`

To load from an icon name, set the `iconName` property when constructing the image.

We can use this feature to place icons on buttons:

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

const button = new Gtk.Button();
button.add(new Gtk.Image({ iconName: 'input-mouse' }))
button.connect('clicked', () => {
    log('The button was clicked!');
});

const win = new Gtk.Window({ defaultHeight: 600, defaultWidth: 800 });
win.connect('destroy', () => { Gtk.main_quit(); });
win.add(button);
win.show_all();

Gtk.main();
```

<!--TODO ### Loading from an Array of Pixels-->