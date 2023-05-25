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
    constructor() {
        super();

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
    constructor(params = {}) {
        super(params);

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

## Defining Interfaces

::: tip
GObject Interfaces exist to implement type safe multiple-inheritance in the C
programming language, while JavaScript code should usually just use mix-ins.
:::

Interfaces are defined in GJS by inheriting from `GObject.Interface` and
providing the class definition property `Requires`. This field must include a
base type that is `GObject.Object` or a subclass of `GObject.Object`.

The `Requires` field may also contain multiple other interfaces that are either
implemented by the base type, or that the implementation is expected to. For
example, `Requires: [GObject.Object, Gio.Action]` indicates that an
implementation must provide methods, properties and emit signals from the
[`Gio.Action`][gaction] interface, or be derived from a base type that does.

[gaction]: https://gjs-docs.gnome.org/gio20/gio.action

#### Defining Methods

Methods defined on an interface must be implemented, if the method throws the
special error `GObject.NotImplementedError()`. Methods that do not throw this
error are optional to implement.

Note that unlike GObject Interfaces defined by a C library, methods are
overridden directly rather than by virtual function. For example, instead of
overriding `vfunc_requiredMethod()`, you should override `requiredMethod()`.

#### Defining Properties

Properties defined on an interface must always be implemented, using
`GObject.ParamSpec.override()` in the `Properties` class definition property.
The implementation should also provide `get` and `set` methods for the
property, as indicated by the [GObject Property Flags][gproperty-flags].

[gproperty-flags]: subclassing.html#property-flags

#### Defining Signals

Signals defined on an interface do not need to be implemented. Typically
interface definitions will provide emitter methods, such as with
[`Gio.ListModel.items_changed()`][glistmodel-itemschanged], otherwise they can
be emitted by calling [`GObject.Object.prototype.emit()`][gobject-emit] on an
instance of the implementation.

[gaction]: https://gjs-docs.gnome.org/gio20/gio.action
[glistmodel-itemschanged]: https://gjs-docs.gnome.org/gio20/gio.listmodel#method-items_changed
[gobject-emit]: https://gjs-docs.gnome.org/gjs/overrides.md#gobject-object-emit

### A Simple Interface

Below is a simple example of defining an interface that only requires
`GObject.Object`:


```js
const GObject = imports.gi.GObject;

const SimpleInterface = GObject.registerClass({
    GTypeName: 'SimpleInterface',
    Requires: [GObject.Object],
    Properties: {
        'simple-property': GObject.ParamSpec.boolean(
            'simple-property',
            'Simple property',
            'A property that must be implemented',
            GObject.ParamFlags.READABLE,
            true
        ),
    },
    Signals: {
        'simple-signal': {},
    },
}, class SimpleInterface extends GObject.Interface {

    /**
     * By convention interfaces provide methods for emitting their signals, but
     * you can always call `emit()` on the instance of an implementation.
     */
    emitSimple() {
        this.emit('simple-signal');
    }

    /**
     * Interfaces can define methods that MAY be implemented, by providing a
     * default implementation.
     */
    optionalMethod() {
        return true;
    }

    /**
     * Interfaces can define methods that MUST be implemented, by throwing the
     * special error `GObject.NotImplementedError()`.
     */
    requiredMethod() {
        throw new GObject.NotImplementedError();
    }
});
```

Note that unlike with interfaces defined by C libraries, we override methods
like `requiredMethod()` directly, not `vfunc_requiredMethod()`. Below is a
minimal implementation of `SimpleInterface`:

```js
const GObject = imports.gi.GObject;

const SimpleImplementation = GObject.registerClass({
    Implements: [SimpleInterface],
    Properties: {
        'simple-property': GObject.ParamSpec.override('simple-property',
            SimpleInterface),
    },
}, class SimpleImplementation extends GObject.Object {

    get simple_property() {
        return true;
    }

    requiredMethod() {
        log('requiredMethod() implemented');
    }
});
```

Instances of the implementation can then be constructed like any class. The
`instanceof` operator can be used to confirm the base class (i.e. `GObject`) and
any interfaces it implements:

```js
const simpleInstance = new SimpleImplementation();

if (simpleInstance instanceof GObject.Object)
    log('An instance of a GObject');

if (simpleInstance instanceof SimpleInterface)
    log('An instance implementing SimpleInterface');

if (!(simpleInstance instanceof Gio.ListModel))
    log('Not an implementation of a list model');
```

### A Complex Interface

More complex interfaces can also be defined that depend on other interfaces,
including those defined in GJS. `ComplexInterface` depends on `Gio.ListModel`
and `SimpleInterface`, while adding a property and a method.

```js
const {Gio, GObject} = imports.gi;

const ComplexInterface = GObject.registerClass({
    GTypeName: 'ComplexInterface',
    Requires: [Gio.ListModel, SimpleInterface],
    Properties: {
        'complex-property': GObject.ParamSpec.boolean(
            'complex-property',
            'Complex property',
            'A property that must be implemented',
            GObject.ParamFlags.READABLE,
            true
        ),
    },
}, class ComplexInterface extends GObject.Interface {

    complexMethod() {
        throw new GObject.NotImplementedError();
    }
});
```

An implementation of this interface must then meet the requirements of
`Gio.ListModel` and `SimpleInterface`, which both require `GObject.Object`. The
following implementation of `ComplexInterface` will meet the requirements of:

* `GObject.Object` by inheriting from [`Gio.ListStore`][gliststore], a subclass
    of `GObject.Object` subclass
* `Gio.ListModel` by inheriting from [`Gio.ListStore`][gliststore], which
    implements `Gio.ListModel`
* `SimpleInterface` by implementing its methods and properties
* `ComplexInterface` by implementing its methods and properties

```js
const {Gio, GObject} = imports.gi;

const ComplexImplementation = GObject.registerClass({
    Implements: [Gio.ListModel, SimpleInterface, ComplexInterface],
    Properties: {
        'complex-property': GObject.ParamSpec.override('complex-property',
            ComplexInterface),
        'simple-property': GObject.ParamSpec.override('simple-property',
            SimpleInterface),
    },
}, class ComplexImplementation extends Gio.ListStore {
    get complex_property() {
        return false;
    }

    get simple_property() {
        return true;
    }

    complexMethod() {
        log('complexMethod() implemented');
    }

    requiredMethod() {
        log('requiredMethod() implemented');
    }
});
```

By using `instanceof`, we can confirm both the inheritance and interface support
of the implementation:

```js
let complexInstance = new ComplexImplementation();

if (complexInstance instanceof GObject.Object &&
    complexInstance instanceof Gio.ListStore)
    log('An instance with chained inheritance');

if (complexInstance instanceof Gio.ListModel &&
    complexInstance instanceof SimpleInterface &&
    complexInstance instanceof ComplexInterface)
    log('An instance implementing three interfaces');
```

[gliststore]: https://gjs-docs.gnome.org/gio20/gio.liststore
