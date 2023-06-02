---
title: GValue
---

# GValue

[`GObject.Value`][gvalue] is a generic value container, usually only used to
implement [GObject Properties](basics.md#properties) in projects written with
the C programming language. By storing the value type alongside the value, it
allows for dynamic type features usually not available to C programmers.

In JavaScript, this behavior is part of the language (i.e. `typeof`) and GJS
will usually convert them automatically, but there are some situations that
require using `GObject.Value` directly.

[gvalue]: https://gjs-docs.gnome.org/gobject20/gobject.value

## Basic Usage

Before a newly created GValue can be used, it must be initialized to hold a
specific [GType](gtype.md#type-constants):

```js
const {GObject} = imports.gi;


// Create a new GValue
const value = new GObject.Value();

// Initialize it to hold a boolean
value.init(GObject.TYPE_BOOLEAN);
```

The value can then be set directly, or passed to a function that takes it as an
argument and sets the value.

```js
const {GObject} = imports.gi;


// Create a new GValue
const value = new GObject.Value();
value.init(GObject.TYPE_STRING);

// Set and get the value contents
value.set_string('string value');

if (value.get_string() === 'string value')
    console.debug('GValue was set correctly');
```

The type of an initialized `GObject.Value` can be checked by calling
[`GObject.type_check_value_holds()`][gvalue-check]:

```js
const {GObject} = imports.gi;


const booleanValue = new GObject.Value();
booleanValue.init(GObject.TYPE_BOOLEAN);

if (GObject.type_check_value_holds(booleanValue, GObject.TYPE_BOOLEAN)
    log('GValue initialized to hold boolean values');

if (!GObject.type_check_value_holds(booleanValue, GObject.TYPE_STRING)
    log('GValue not initialized to hold string values');
```

[gvalue-check]: https://gjs-docs.gnome.org/gobject20/gobject.type_check_value_holds

## GObject Properties

Although you should always use JavaScript property accessors for native values,
the `GObject.Object.get_property()` and `GObject.Object.set_property()` methods
can be used to work with a `GObject.Value` that will be passed to another
function.

```js
const {GObject, Gio} = imports.gi;


const action = new Gio.SimpleAction({
    name: 'test',
    enabled: false,
});


// Create a new boolean GValue
const booleanValue = new GObject.Value();
booleanValue.init(GObject.TYPE_BOOLEAN);


// Populate the GValue from a GObject property
action.get_property('enabled', booleanValue);

// Check the result
if (booleanValue.get_boolean())
    log(`${action.name} is enabled`);
else
    log(`${action.name} is disabled`);
    
    
// Set the GValue directly
booleanValue.set_boolean(true);

// Set a GObject property to the GValue content
action.set_property('enabled', booleanValue);
```

## Return Values and Callback Arguments

There are situations where a function may expect a particular value type (e.g.
`GObject.TYPE_INT64`), but GJS can not determine this from the incoming type
(e.g. `Number`). However, in most cases when `GObject.Value` is returned from
functions or passed as callback arguments, they will be automatically unpacked.

Below is a non-functional example of Drag-n-Drop, where the `GObject.Value` is
automatically unpacked for the `Gtk.DropTarget::drop` signal:

```js
const {GObject, Gtk} = imports.gi;


// Create a GObject to pass around
const objectInstance = new GObject.Object();


// A GValue can be used to pass data via Drag-n-Drop
const dragSource = new Gtk.DragSource({
    actions: Gtk.DragAction.COPY,
});

dragSource.connect('prepare', (_dragSource, _x, _y) => {
    const value = new GObject.Value();
    value.init(GObject.Object);
    value.set_object(objectInstance);

    return Gdk.ContentProvider.new_for_value(value);
});


// The Drag-n-Drop target receives the unpacked value
const dropTarget = Gtk.DropTarget.new(GObject.Object,
    Gdk.DragAction.COPY);

dropTarget.connect('drop', (_dropTarget, value, _x, _y) => {
    if (value instanceof GObject.Object)
        console.debug('The GObject.Value was unpacked to a GObject.Object');
});
```

