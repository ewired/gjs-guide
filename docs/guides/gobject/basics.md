---
title: The Basics
---

# The Basics of GObject

GObject is the base upon which most of the GNOME platform is built. This is a gentle introduction to using GObject in GJS, including constructing object, using properties and connecting to signals.

## GObject Construction

The most common way to create a new GObject is using the `new` keyword. When constructing a GObject this way, you can pass a dictionary of properties:

```js
const Gtk = imports.gi.Gtk;

let myLabel = new Gtk.Label({
    label: 'Example',
    visible: true,
});
```

Many classes also have **constructor methods** you can use directly:

```js
const Gtk = imports.gi.Gtk;

let myLabel = Gtk.Label.new('Example');
```

## Properties

GObject supports a property system that is slightly more powerful than native JavaScript properties.

### Accessing Properties

GObject properties may be retrieved and set using native property style access or GObject get/set methods.

```js
const Gtk = imports.gi.Gtk;

let myLabel = Gtk.Label.new('Example');
let value;

// Three different ways to get or set properties
value = myLabel.visible;
value = myLabel['visible'];
value = myLabel.get_visible();

myLabel.visible = true;
myLabel['visible'] = true;
myLabel.set_visible(true);
```

GObject property names have a canonical form that is `kebab-cased`, however they are accessed differently depending on the situation:

```js
const Gtk = imports.gi.Gtk;

let myLabel = Gtk.Label.new('Example');
let value;

// If using native accessors, you can use `underscore_case` or `camelCase`
value = myLabel.use_markup;
value = myLabel.useMarkup;

// Anywhere the property name is a string, you must use `kebab-case`
myLabel['use-markup'] = true;
myLabel.connect('notify::use-markup', () => {});

// Getter and setter functions are always case sensitive
value = myLabel.get_use_markup();
myLabel.set_use_markup(true);
```

### Property Change Notification

Most GObject properties will emit the [`notify`][gobject-notify] signal when they are changed (more on [signals](#signals) below). You can connect to this signal in the form of `notify::property-name` to invoke a callback when it changes:

```js
const Gtk = imports.gi.Gtk;

let myLabel = Gtk.Label.new('Example');

let labelId = myLabel.connect('notify::label', (obj) => {
    log(`New label is "${obj.label}"`);
});
```

[gobject-notify]: https://gjs-docs.gnome.org/gobject20/gobject.object#signal-notify

### Property Bindings

GObject provides a simple way to bind a property between objects, which can be used to link the state of two objects. The direction and behaviour can be controlled by the [`GObject.BindingFlags`][gobject-binding-flags] passed when the binding is created.

```js
const {GObject, Gtk} = imports.gi;

let myBox = new Gtk.Box();
let myLabel = Gtk.Label.new('Example');

// Bind the visibility of the box and label
myBox.bind_property('visible', myLabel, 'visible',
    GObject.BindingFlags.SYNC_CREATE | GObject.BindingFlags.BIDIRECTIONAL);

// Try to make the properties different
myBox.visible = !myLabel.visible;

if (myBox.visible === myLabel.visible)
    log('properties are equal!');
```

If you need to transform the value between the source and target, you can use [`bind_property_full`][bind-property-full].

```js
const {GObject, Gtk} = imports.gi;

let button = new Gtk.Button({
    label: 'go';
});
let entry = new Gtk.Entry({});

entry.bind_property_full(
    "text",
    button,
    "sensitive",
    GObject.BindingFlags.DEFAULT,
    (binding, value) => [true, !!value],
    null,
);
```

[gobject-binding-flags]: https://gjs-docs.gnome.org/gobject20/gobject.bindingflags
[bind-property-full]: https://gjs-docs.gnome.org/gobject20/gobject.object#method-bind_property_with_closures

## Signals

GObjects support a signaling system, similar to events and EventListeners in the JavaScript Web API. Here we will cover the basics of connecting and disconnection signals, as well as using callbacks.

### Connecting Signals

Signals are connected by calling the `connect()` method, which returns a handler ID that is always truthy. Signals are disconnected by passing that ID to `disconnect()`:

```js
const Gtk = imports.gi.Gtk;

let myLabel = Gtk.Label.new('Example');

// Connecting a signal
let handlerId = myLabel.connect('copy-clipboard', (label) => {
    log('copy-clipboard emitted!');
});

// Disconnecting a signal
if (handlerId)
    myLabel.disconnect(handlerId);
```

### Callback Arguments

Signals often have multiple callback arguments, but the first is always the emitting object:

```js
const Gtk = imports.gi.Gtk;

let myLabel = Gtk.Label.new('Example');

myLabel.connect('populate-popup', (label, menu) => {
    log('populate-popup emitted!);

    if (myLabel === label)
        log('myLabel emitted the signal!');

    if (menu instanceof Gtk.Menu)
        log('it emitted it with a GtkMenu argument!');
});
```

### Callback Return Values

In some cases, signals expect a return value (usually a `boolean`). The effect of the return value will be described in the documentation for the signal.

```js
const {Gdk, Gtk} = imports.gi;

let myLabel = new Gtk.Label({
    label: '<a href="https://www.gnome.org">GNOME</a>',
    use_markup: true,
});

// The `activate-link` signal expects a boolean return value: true if the link
// activation was handled by the callback or false if not
myLabel.connect('activate-link', (label, uri) => {
    log(`activate-link emitted for ${uri}`);

    // We'll return the success boolean returned by `Gtk.show_uri_on_window()`
    if (uri.includes('gnome.org')) {
        return Gtk.show_uri_on_window(label.get_toplevel(), uri,
            Gdk.CURRENT_TIME);
    }

    // If we're not trying handling this link at all, we'll just return `false`
    return false;
});
```

