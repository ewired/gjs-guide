# Running GTK+ in GJS

Throughout this tutorial you will see small examples of GTK+ code in GJS.

They will usually occur in this format:

```js
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

/* create a widget to demonstrate */

let win = new Gtk.Window();
win.add(/* widget */);
win.show_all();

Gtk.main();
```

Let's break that down!

```js{1}
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

...
```

The first line indicates that this is a GJS script. You may have seen similar statements starting bash scripts:

```sh
#!/usr/bin/sh
```

This statement is called a shebang.

```js{3}
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

...
```

Next we have our import statements. The first imports line is a version statement. This tells GJS what version of the import we need. GTK+ has the older GTK+ 2.0 and the newer GTK+ 3.0. To indicate this we pass `"3.0"` to `imports.gi.versions.Gtk`. This works for any other import too, just set the name of the import at `imports.gi.versions` to the version you are importing.

```js{4}
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

...
```

The second import line actually imports Gtk. This allows use to use all of Gtk's widgets and classes. It is declared with `const` because an import, by convention, should never change values. We are importing from `imports.gi` because GTK+ is part of the `gi` (gobject-introspection) collection.

```js{3}
...

Gtk.init(null);

/* create a widget to demonstrate */

let win = new Gtk.Window();

...
```

Now we have to *initialize* GTK+. If GTK+ is not initialized your application will not run.

*Imagine trying to adjust the radio before you have started the car.*

Always pass `null` to `Gtk.init()`!

Next we will create the widget we are demonstrating, this section will vary in each example.

```js
...

let win = new Gtk.Window();
win.add(/* widget */);
win.show_all();

Gtk.main();
```

Now we will create a `Gtk.Window` to store the widget in. We call `Gtk.Window.prototype.add()` to add the widget to the window and finally `Gtk.Window.prototype.show_all()` to make both the window and the widget visible to the user.

```js{14}
#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gtk } = imports.gi;

Gtk.init(null);

/* create a widget to demonstrate */

let win = new Gtk.Window();
win.add(/* widget */);
win.show_all();

Gtk.main();
```

Finally we call `Gtk.main()` to start the event loop we discussed in [The Basics](./01-basics.html).

*Gtk.main() is the gas pedal of GTK+!*

