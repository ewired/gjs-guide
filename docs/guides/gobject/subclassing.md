---
title: Subclasses
---

# GObject Subclassing

Subclassing is a convenient way to extend most GObject classes, allowing you to define additional methods, properties and signals. If you haven't read the [GObject Basics](basics.md) guide already some of the concepts in this guide may be unfamiliar to you, so consider reading that first.

## Subclassing GObject

::: warning
Note that prior to GJS 1.72 (GNOME 42), it was required to override `_init()` and chain-up with `super._init()` instead of the standard `constructor()`.
:::

Every class of GObject has a globally unique [GType](#gtype) and so each subclass must be registered using the `GObject.registerClass()` function. This function takes a dictionary of GObject attributes as the first argument, and a JavaScript class declaration as its second argument.

Below is an example of a GObject class declaration with [`GTypeName`](#gtypename), [`Properties`](#properties) and [`Signals`](#signals) defined.

```js
const GObject = imports.gi.GObject;

const SubclassExample = GObject.registerClass({
    GTypeName: 'SubclassExample',
    Properties: {
        'example-property': GObject.ParamSpec.boolean(
            'example-property',
            'Example Property',
            'A read-write boolean property',
            GObject.ParamFlags.READWRITE,
            true
        ),
    },
    Signals: {
        'example-signal': {},
    },
}, class SubclassExample extends GObject.Object {
    constructor(constructProperties = {}) {
        super(constructProperties);
    }

    get example_property() {
        if (this._example_property === undefined)
            this._example_property = null;

        return this._example_property;
    }

    set example_property(value) {
        if (this.example_property === value)
            return;

        this._example_property = value;
        this.notify('example-property');
    }
});
```

## GTypeName

By default, the `GType` name of a subclass in GJS will be the class name prefixed with `Gjs_`. Usually setting a custom name is not necessary unless you need to refer to the type by name, such as in a `GtkBuilder` interface definition.

To specify a custom `GType` name, you can pass it as the value for the `GTypeName` property to `GObject.registerClass()`:

```js
const GObject = imports.gi.GObject;

const SubclassOne = GObject.registerClass({
}, class SubclassOne extends GObject.Object {
});

const SubclassTwo = GObject.registerClass({
    GTypeName: 'CustomName',
}, class SubclassTwo extends GObject.Object {
});

// expected output: 'Gjs_SubclassOne'
log(SubclassOne.$gtype.name);

// expected output: 'CustomName'
log(SubclassTwo.$gtype.name);
```

## Properties

Basic usage of GObject properties is covered in the [GObject Basics](basics.md#properties) guide. This section will cover more advanced usage of GObject properties, specifically relating to GObject subclasses defined in GJS.

### Declaring Properties

When defining properties of a GObject subclass, the properties must be declared in the `Properties` dictionary of the class definition. Each entry contains a [`GObject.ParamSpec`][gparamspec] defining the attributes and behaviour of the property, while the `get` and `set` accessors control the value.

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Properties: {
        'example-property': GObject.ParamSpec.boolean(
            'example-property',
            'Example Property',
            'A read-write boolean property',
            GObject.ParamFlags.READWRITE,
            true
        ),
    },
}, class Example extends GObject.Object {

    get example_property() {
        return this._example_property || false;
    }

    set example_property(value) {
        this._example_property = value;
    }
});
```

The class defined above can then be constructed with a dictionary of the declared properties:

```js
let obj = new Example({
    example_property: true,
});

// Getting the property
// expected output: true
log(obj.example_property);

// Setting the property
obj.example_property = false;
```

[gparamspec]: https://gjs-docs.gnome.org/gobject20/gobject.paramspec

### Property Types

`Boolean` and `String` properties are the simplest of properties. The default value for a `Boolean` should be `true` or `false`, but a `String` property may have a `null` default.

```js
const defaultValue = true;

const pspec = GObject.ParamSpec.boolean(
    'boolean-property',
    'Boolean Property',
    'A property holding a true or false value',
    GObject.ParamFlags.READWRITE,
    defaultValue
);
```

```js
const defaultValue = 'a string';

const pspec = GObject.ParamSpec.string(
    'string-property',
    'String Property',
    'A property holding a string value',
    GObject.ParamFlags.READWRITE,
    defaultValue
);
```

Properties with number types have additional parameters for the range of the value. There are ten number types:

1. `GObject.ParamSpec.char()`
2. `GObject.ParamSpec.uchar()`
3. `GObject.ParamSpec.int()`
4. `GObject.ParamSpec.uint()`
5. `GObject.ParamSpec.long()`
6. `GObject.ParamSpec.ulong()`
7. `GObject.ParamSpec.int64()` *
8. `GObject.ParamSpec.uint64()` *
9. `GObject.ParamSpec.float()`
10. `GObject.ParamSpec.double()`

The JavaScript [`Number`][number] type is equivalent to `GObject.TYPE_DOUBLE` and can be represented fully by `GObject.ParamSpec.double()`.

As of GJS 1.64 (GNOME 3.38) [`BigInt`][bigint] is supported, but has not yet been mapped to 64-bit types. The 64-bit types `GObject.TYPE_INT64` and `GObject.TYPE_UINT64` are therefore limited by [`Number.MIN_SAFE_INTEGER`][number-min] and [`Number.MAX_SAFE_INTEGER`][number-max].

```js
const minimumValue = Number.MIN_SAFE_INTEGER;
const maximumValue = Number.MAX_SAFE_INTEGER;
const defaultValue = 0;

const pspec = GObject.ParamSpec.double(
    'number-property',
    'Number Property',
    'A property holding a JavaScript Number',
    GObject.ParamFlags.READWRITE,
    minimumValue, maximumValue,
    defaultValue
);
```

There are three property types for more complex values. The property types for GObject and GBoxed require a GType.

```js
const gtype = GObject.Object.$gtype;

const pspec = GObject.ParamSpec.object(
    'object-property',
    'GObject Property',
    'A property holding an object derived from GObject',
    GObject.ParamFlags.READWRITE,
    gtype
);
```

```js
const gtype = GLib.Source.$gtype;

const pspec = GObject.ParamSpec.boxed(
    'boxed-property',
    'GBoxed Property',
    'A property holding a boxed type',
    GObject.ParamFlags.READWRITE,
    gtype
);
```

The property type for GVariant values expects a `GVariantType` describing its contents:

```js
const variantType = new GLib.VariantType('as');

const pspec = GObject.param_spec_variant(
    'variant-property',
    'GVariant Property',
    'A property holding a GVariant value',
    variantType,
    null,
    GObject.ParamFlags.READWRITE,
);
```

Since GJS 1.68 (GNOME 40), there is also support for JavaScript types that derive from the native [`Object`][js-object] type:

```js
const pspec = GObject.ParamSpec.jsobject(
    'jsobject-property',
    'JSObject Property',
    'A property holding a JavaScript object',
    GObject.ParamFlags.READWRITE,
    ''
);
```

[bigint]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt
[number]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[number-min]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
[number-max]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
[js-object]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

### Property Flags

GObject properties are not only strictly typed, but also have with restrictions on if they are read-only, write-only, read-write or changeable after construction. This behaviour is controlled by the [`GObject.ParamFlags`][gparamflags]. Below are the most commonly used flags:

* `GObject.ParamFlags.READABLE`

  A property with this flag can be read.

* `GObject.ParamFlags.WRITABLE`

  A property with this flag is written. Write-only properties are rarely used.

* `GObject.ParamFlags.READWRITE`

  This is an alias for `GObject.ParamFlags.READABLE | GObject.ParamFlags.WRITABLE`.

* `GObject.ParamFlags.CONSTRUCT_ONLY`

  A property with this flag can only be written during construction.


[gparamflags]: https://gjs-docs.gnome.org/gobject20/gobject.paramflags

### Property Change Notification

As introduced in the [GObject Basics](basics.md) guide, all GObjects have a [`notify`][notify-signal] signal that may be emitted when a property changes. GObject subclasses in GJS must explicitly emit this signal for properties by calling [`GObject.Object.notify()`][notify-method].

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Properties: {
        'example-property': GObject.ParamSpec.string(
            'example-property',
            'Example Property',
            'A read-write string property',
            GObject.ParamFlags.READWRITE,
            null
        ),
    },
}, class Example extends GObject.Object {

    get example_property() {
        // Implementing the default value manually
        if (this._example_property === undefined)
            this._example_property = null;

        return this._example_property;
    }

    set example_property(value) {
        // Skip emission if the value has not changed
        if (this.example_property === value)
            return;

        // Set the property value before emitting
        this._example_property = value;
        this.notify('example-property');
    }
});
```

[notify-method]: https://gjs-docs.gnome.org/gobject20/gobject.object#method-notify
[notify-signal]: https://gjs-docs.gnome.org/gobject20/gobject.object#signal-notify

## Signals

Basic usage of GObject signals is covered in the [GObject Basics](basics.md#signals) guide. This section will cover more advanced usage of GObject signals, specifically relating to GObject subclasses defined in GJS.

### Declaring Signals

When defining signals of a GObject subclass, the signals must be declared in the `Signals` dictionary of the class definition. The simplest signals with the default behaviour only require a name.

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Signals: {
        'example-signal': {},
    },
}, class Example extends GObject.Object {
});
```

Callbacks are connected as handlers for the signal, like with any other GObject class:

```js
let obj = new Example();

// Connecting to the signal
let handlerId = obj.connect('example-signal', (example) => {
    log('example-signal emitted!');
});

// Emitting the signal
// expected output: example-signal emitted!
obj.emit('example-signal');

// Disconnecting the signal
obj.disconnect(handlerId);
```

A default signal handler (**object handler**) can be defined in the class, and
the following attributes can also be changed in the signal declaration.

| Key           | Default                         | Description                |
|---------------|---------------------------------|----------------------------|
| `flags`       | `GObject.SignalFlags.RUN_FIRST` | Emission behaviour         |
| `param_types` | `[]` (No arguments)             | List of `GType` arguments  |
| `return_type` | `GObject.TYPE_NONE`             | Return type of callbacks   |
| `accumulator` | `GObject.AccumulatorType.NONE`  | Return value behaviour     |

### Default Handler

Classes can set a default handler for a signal and subclasses can override them. The **object handler** for a signal is always invoked, regardless of whether a **user handler** is connected.

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Signals: {
        'example-signal': {
            flags: GObject.SignalFlags.RUN_FIRST,
        },
    },
}, class Example extends GObject.Object {

    on_example_signal() {
        log('example-signal: object handler');
    }
});
```

The order the default handler is invoked is controlled by whether it has the flag `RUN_FIRST`, `RUN_LAST` or `RUN_CLEANUP`. The signal emission phases are described in the [Signals Documentation](https://developer.gnome.org/gobject/stable/gobject-Signals.html).

```js
let obj = new Example();

obj.connect('example-signal', (example) => {
    log('example-signal: user handler');
});

/* expected output:
 *   example-signal: object handler
 *   example-signal: user handler
 */
obj.emit('example-signal');
```

### Signal Flags

Signal flags can control several aspects of the emission, the most commonly used are below:

* `GObject.SignalFlags.RUN_FIRST`
* `GObject.SignalFlags.RUN_LAST`
* `GObject.SignalFlags.RUN_CLEANUP`

  As explained above, these three flags determine which emission phase the default handler will be invoked.

* `GObject.SignalFlags.DETAILED`

  A signal with this flag allows signal to be emitted with a detail string. For example, the GObject signal `notify` can be emitted with a property name as a detail.

The [`GObject.SignalFlags`][gobject-signalflags] enumeration describes all the possible flags for signals.

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Signals: {
        'example-signal': {
            flags: GObject.SignalFlags.RUN_LAST | GObject.SignalFlags.DETAILED,
        },
    },
}, class Example extends GObject.Object {

    on_example_signal() {
        log('example-signal: object handler');
    }
});
```

The signal above can be connected to with an optional "detail" appended to the signal name. In that case, the handler will only be run if the emission detail matches the handler detail.

Since the `RUN_LAST` flag is used, the **object handler** will run after a **user handler** connected with `GObject.Object.connect()`, but before a **user handler** connected with `GObject.Object.connect_after()`.

```js
let obj = new Example();

obj.connect('example-signal', (obj) => {
    log('example-signal: user handler');
});

obj.connect('example-signal::example-detail', (obj) => {
    log('example-signal: user handler (detailed)');
});

obj.connect_after('example-signal', (obj) => {
    log('example-signal: user handler (after)');
});

/* Expected output:
 * 1. example-signal: user handler
 * 2. example-signal: user handler (detailed)
 * 3. example-signal: object handler
 * 4. example-signal: user handler (after)
 */
obj.emit('example-signal::example-detail');

/* Expected output:
 * 1. example-signal: user handler
 * 2. example-signal: object handler
 * 3. example-signal: user handler (after)
 */
obj.emit('example-signal::different-detail');
```


[gobject-signalflags]: https://gjs-docs.gnome.org/gobject20/gobject.signalflags

### Signal Parameters

The first argument for a signal callback is always the emitting object, but additional parameters can also be defined for signals using the `param_types` key:

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Signals: {
        'example-signal': {
            param_types: [GObject.TYPE_BOOLEAN, GObject.TYPE_STRING],
        },
    },
}, class Example extends GObject.Object {
});
```

Callbacks then receive the additional parameter value as function arguments:

```js
let obj = new Example();

obj.connect('example-signal', (emittingObject, arg1, arg2) => {
    if (arg1) {
        log(`example-signal emitted: ${arg2}`);
    }
});

// expected output: "example-signal emitted: foobar"
obj.emit('example-signal', true, 'foobar');
```

### Signal Return Values

Signals may be configured to require a return value from handlers, allowing a callback to communicate to the emitting object. In most cases this is a `boolean` value, but other types are possible.

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Signals: {
        'example-signal': {
            return_type: GObject.TYPE_BOOLEAN,
        },
    },
}, class Example extends GObject.Object {
});
```

Callbacks for the signal should return an appropriate value, which the emitting object can act on:

```js
let obj = new Example();

obj.connect('example-signal', (emittingObject) => {
    return true;
});

// expected output: "signal handler returned true"
if (obj.emit('example-signal'))
    log('signal handler returned true');
else
    log('signal handler returned false');
```


### Signal Accumulator

Signal accumulators are special functions that collect the return values of callbacks, similar to how [`reduce()`][javascript-reduce] works. Currently GJS only supports two built-in accumulators:

* `GObject.AccumulatorType.NONE`

  This is the default.

* `GObject.AccumulatorType.FIRST_WINS`

  This accumulator will use the return value of the first handler that is run. A signal with this accumulator may have a return of any type.

* `GObject.AccumulatorType.TRUE_HANDLED`

  This accumulator will stop emitting once a handler returns `true`. A signal with this accumulator must have a return type of `GObject.TYPE_BOOLEAN`.

Below is an example of declaring a signal with the `TRUE_HANDLED` accumulator that stops signal emission after the second user callback returns `true`.

```js
const GObject = imports.gi.GObject;

const Example = GObject.registerClass({
    Signals: {
        'example-signal': {
            flags: GObject.SignalFlags.RUN_LAST,
            accumulator: GObject.AccumulatorType.TRUE_HANDLED,
            return_type: GObject.TYPE_BOOLEAN,
        },
    },
}, class Example extends GObject.Object {
    on_example_signal() {
        log('example-signal: default handler');
        return true;
    }
});
```

It can be seen that when emitting the signal, the first connected handler that returns `true` prevents later user handlers and the default handler from running:

```js
let obj = new Example();

obj.connect('example-signal', (example) => {
    log('example-signal: first handler');
    return false;
});

obj.connect('example-signal', (example) => {
    log('example-signal: second handler');
    return true;
});

obj.connect('example-signal', (example) => {
    log('example-signal: third handler');
    return true;
});

/* expected output:
 *   example-signal: first handler
 *   example-signal: second handler
 */
obj.emit('example-signal');
```

[javascript-reduce]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

