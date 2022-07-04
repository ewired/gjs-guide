---
title: GType
---

# GType

GType is the foundation of the GObject system. Although it is rarely necessary to interact with a GType directly in GJS, there are some situations where you may need to pass a GType as a function argument or in a class definition.

## GType Object

Every GObject class has a static `$gtype` property that gives a GType object for the given type. This is the proper way to find the GType given an object or a class. For a class, `GObject.type_from_name('GtkLabel')` would work too if you know the GType name, but only if you had previously constructed a `Gtk.Label` object.

```js
const GObject = imports.gi.GObject;

let objectInstance = new GObject.Object();

// Both of these calls return the same GType object
// expected output: [object GType for 'GObject']
log(GObject.Object.$gtype);
log(objectInstance.constructor.$gtype);
```

[`instanceof`][mdn-instanceof] can be used to compare an object instance to a **constructor object**.

```js
log(typeof objectInstance);
// expected output: object

log(objectInstance instanceof GObject.Object);
// expected output: true
```

[mdn-instanceof]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/instanceof

## GTypeName

The `name` property of a GType object gives the GType name as a string ('GObject' in the example above). This is the proper way to find the type name given an object or a class. By default, the GType name of a subclass in GJS will be the class name prefixed with `Gjs_`:

```js
const GObject = imports.gi.GObject;

const MySubclass = GObject.registerClass({
}, class MySubclass extends GObject.Object {
});

let obj = new GObject.Object();
let myObject = new Subclass();

// expected output: 'GObject'
log(GObject.Object.$gtype.name);
log(obj.constructor.$gtype.name);

// expected output: 'Gjs_MySubclass'
log(MySubclass.$gtype.name);
log(myObject.constructor.$gtype.name);
```

In most cases you will not need to specify your own name, unless you are creating a GtkBuilder template class:

```xml
<interface>
  <template class="MyBox" parent="GtkBox">
    <!-- Template Definition -->
  </template>
</interface>
```

To set the GType name, pass it as the value for the `GTypeName` property to `GObject.registerClass()`:

```js
const MyBox = GObject.registerClass({
    GTypeName: 'MyBox',
}, class MyBox extends Gtk.Box {
});

let box = new MyBox();

// expected output: 'MyBox'
log(MyBox.$gtype.name);
log(box.constructor.$gtype.name);
```

## Type Constants

For convenience, GJS has predefined constants for a number of built-in types. Usually these will only be used when defining [properties](subclassing.md#properties) and [signals](subclassing.md#signals). These are equivalent to the `$gtype` property of a given object:

```js
if (GObject.Object.$gtype === GObject.TYPE_OBJECT)
    log('equivalent');

// All number types are based on JavaScript's Number
if (GObject.TYPE_INT === Number.$gtype &&
    GObject.TYPE_DOUBLE === Number.$gtype)
    log('equivalent');
```

| Constant                 | GLib             | JavaScript          |
|--------------------------|------------------|---------------------|
| `GObject.TYPE_BOOLEAN`   | `gboolean`       | `Boolean`           |
| `GObject.TYPE_STRING`    | `gchararray`     | `String`            |
| `GObject.TYPE_INT`       | `gint`           | `Number`            |
| `GObject.TYPE_UINT`      | `guint`          | `Number`            |
| `GObject.TYPE_LONG`      | `glong`          | `Number`            |
| `GObject.TYPE_ULONG`     | `gulong`         | `Number`            |
| `GObject.TYPE_INT64`     | `gint64`         | `Number`            |
| `GObject.TYPE_UINT64`    | `guint64`        | `Number`            |
| `GObject.TYPE_FLOAT`     | `gfloat`         | `Number`            |
| `GObject.TYPE_DOUBLE`    | `gdouble`        | `Number`            |
| `GObject.TYPE_ENUM`      | `GEnum`          | `Number`            |
| `GObject.TYPE_FLAGS`     | `GFlags`         | `Number`            |
| `GObject.TYPE_OBJECT`    | `GObject`        | `GObject.Object`    |
| `GObject.TYPE_INTERFACE` | `GInterface`     | `GObject.Interface` |
| `GObject.TYPE_BOXED`     | `GBoxed`         |                     |
| `GObject.TYPE_POINTER`   | `gpointer`       | nothing             |
| `GObject.TYPE_PARAM`     | `GParam`         | `GObject.ParamSpec` |
| `GObject.TYPE_VARIANT`   | `GVariant`       | `GLib.Variant`      |
| `GObject.TYPE_GTYPE`     | `GType`          | `GObject.Type`      |
| `GObject.TYPE_JSOBJECT`  | `GBoxed`         | `Object`            |


### JavaScript Types

`GObject.TYPE_JSOBJECT` is a special `GType` in GJS, created so that JavaScript types that inherit from [`Object`][js-object] can be used with the GObject framework. This allows you to use them as [properties][gobject-properties] and in [signal parameters][gobject-signals] in your GObject subclasses, and in some cases pass it to functions that take a `GType`.

In particular, this means that you may use `Object` (ie. `{}`) and `Array` (ie. `[]`) types, but also more complex types such as `Date` and `Function`. Note that `GObject.TYPE_JSOBJECT` is a boxed type (`GObject.TYPE_BOXED`), so it may not be used where a GObject (`GObject.TYPE_OBJECT`) is expected such as with [`Gio.ListModel`][glistmodel].

```js
// A GObject subclass with JavaScript Object properties and signals
const Example = GObject.registerClass({
    Properties: {
        'example-property': GObject.ParamSpec.jsobject(
            'example-property',
            'Example Property',
            'A property that holds a JavaScript Object',
            GObject.ParamFlags.READWRITE,
            ''
        ),
    },
    Signals: {
        'example-signal': {
            param_types: [GObject.TYPE_JSOBJECT],
        },
    },
}, class Example extends GObject.Object {
    get example_property() {
        if (this._example_property === undefined)
            this._example_property = {};
            
        return this._example_property;
    }
    
    set example_property(obj) {
        if (this.example_property === obj)
            return;
            
        this._example_property = obj;
        this.notify('example-object');
    }
    
    emitExampleSignal(obj) {
        this.emit('example-signal', obj);
    }
});
```


[js-object]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[glistmodel]: https://gjs-docs.gnome.org/gio20/gio.listmodel
[gobject-properties]: https://gjs.guide/guides/gobject/subclassing.html#properties
[gobject-signals]: https://gjs.guide/guides/gobject/subclassing.html#signal-parameters

