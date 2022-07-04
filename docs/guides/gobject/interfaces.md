---
title: Interfaces
---

# GObject Interfaces

In plain JavaScript interfaces are usually informal and simply fulfilled by the presence of certain methods and properties on an object. However, you may recognize interfaces from TypeScript, where an object's type includes information about its capabilities. GObject interfaces are a way of ensuring that objects passed to C code have the right capabilities.

Take for example the [`GIcon`][gicon] interface, which is implemented by [`GFileIcon`][gfileicon] for file-based icons and [`GThemedIcon`][gthemedicon] for themed icons, among others. Any class implementing the interface can then be passed to objects like [`GtkImage`][gtkimage] which can display them in a user interface.


[gicon]: https://gjs-docs.gnome.org/gio20/gio.icon
[gfileicon]: https://gjs-docs.gnome.org/gio20/gio.fileicon
[gthemedicon]: https://gjs-docs.gnome.org/gio20/gio.themedicon
[gtkimage]: https://gjs-docs.gnome.org/gtk30/gtk.image

## Implementing Interfaces

Implementing an interface involves providing working implementations for class methods and properties defined by the interface.

### Methods

Interfaces that require methods to be implemented must have the corresponding virtual function defined in the class. For example, the virtual function for the `Gio.ListModel` method `get_item()` is `vfunc_get_item()`. When a caller invokes `Gio.ListModel.get_item()` on an object it will defer to the virtual function of the implementation.

This is different from overriding a function in native JavaScript classes and interfaces, where the method should be overriden using the original member name.

Below is an example implementation of the [`Gio.ListModel`][glistmodel] interface which only requires implementing three methods:


```js
const {Gio, GObject} = imports.gi;


var ArrayStore = GObject.registerClass({
    Implements: [Gio.ListModel],
}, class ArrayStore extends GObject.Object {
    _init() {
        super._init();

        /* A native Array as internal storage for the list model */
        this._items = [];
    }

    /* Implementing this function amounts to returning a GType. This could be a
     * more specific GType, but must be a type of GObject. */
    vfunc_get_item_type() {
        return GObject.Object.$gtype;
    }

    /* Implementing this function just requires returning the GObject at
     * @position or %null if out-of-range. This must explicitly return `null`,
     * not `undefined`. */
    vfunc_get_item(position) {
        return this._items[position] || null;
    }

    /* Implementing this function is as simple as return the length of the
     * storage object, in this case an Array. */
    vfunc_get_n_items() {
        return this._items.length;
    }

    /**
     * Insert an item in the list. If @position is greater than the number of
     * items in the list or less than `0` it will be appended to the end of the
     * list.
     *
     * @param {GObject.Object} item - the item to add
     * @param {number} [position] - the position to add the item
     */
    insertItem(item, position = -1) {
        // Type check the item
        if (!(item instanceof GObject.Object))
            throw TypeError(`Not a GObject: ${item.constructor.name}`);

        if (!GObject.type_is_a(item.constructor.$gtype, this.get_item_type())
            throw TypeError(`Invalid type: ${item.constructor.$gtype.name}`);

        // Normalize the position
        if (position < 0 || position > this._items.length)
            position = this._items.length;

        // Insert the item and emit Gio.ListModel::items-changed
        this._items.splice(position, 0, item);
        this.items_changed(position, 0, 1);
    }

    /**
     * Remove the item at @position. If @position is outside the length of the
     * list, this function does nothing.
     *
     * @param {number} position - the position of the item to remove
     */
    removeItem(position) {
        if (position < 0 || position >= this._items.length)
            return;

        // Remove the item and emit Gio.ListModel::items-changed
        this._items.splice(position, 1);
        this.items_changed(position, 1, 0);
    }
});
```

[glistmodel]: https://gjs-docs.gnome.org/gio20/gio.listmodel

### Properties

Interfaces that require properties to be implemented must have the GParamSpec overridden in the class registration, as well as the JavaScript getter and/or setter implemented.

Below is an example of implementing the [`GtkOrientable`][gtkorientable] interface from Gtk3, which only requires implementing one property. The `orientation` property is a read-write property, so we implement both `get` and `set` functions and register it in the properties dictionary.

```js
imports.gi.versions.Gtk = '3.0';
const {GObject, Gtk} = imports.gi;


var ExampleOrientable = GObject.registerClass({
    Implements: [Gtk.Orientable],
    Properties: {
        'orientation': GObject.ParamSpec.override('orientation', Gtk.Orientable),
    },
}, class ExampleOrientable extends GObject.Object {

    get orientation() {
        if (this._orientation === undefined)
            this._orientation = Gtk.Orientation.HORIZONTAL;

        return this._orientation;
    }

    set orientation(value) {
        if (this.orientation === value)
            return;

        this._orientation = value;
        this.notify('orientation');
    }
});
```

[gtkorientable]: https://gjs-docs.gnome.org/gtk30/gtk.orientable

### Multiple Interfaces

It is also possible for a class to implement multiple interfaces. The example below is an incomplete example of a container widget implementing both `Gtk.Orientable` and `Gio.ListModel`:

```js
const {Gio, GObject, Gtk} = imports.gi;

var ListWidget = GObject.registerClass({
    Implements: [Gio.ListModel, Gtk.Orientable],
    Properties: {
        'orientation': GObject.ParamSpec.override('orientation', Gtk.Orientable),
    },
}, class ListWidget extends Gtk.Widget {
    _init(params = {}) {
        super._init(params);

        this._children = [];
    }

    get orientation() {
        if (this._orientation === undefined)
            this._orientation = Gtk.Orientation.HORIZONTAL;

        return this._orientation;
    }

    set orientation(value) {
        if (this.orientation === value)
            return;

        this._orientation = value;
        this.notify('orientation');
    }

    vfunc_get_item_type() {
        return Gtk.Widget.$gtype;
    }

    vfunc_get_item(position) {
        return this._children[position] || null;
    }

    vfunc_get_n_items() {
        return this._children.length;
    }
});
```
