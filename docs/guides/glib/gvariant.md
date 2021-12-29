---
title: GVariant
---

# GVariant

[`GLib.Variant`][gvariant] is a value container whose types are determined at
construction, often with type strings. Notably all DBus method, property and
signal values are `GLib.Variant` objects.

In some ways you can think of GVariant like JSON and each `GLib.Variant` object
like a JSON document. It's a format for storing structured data that can be
serialized while preserving type information.

```js
// Serializing JSON to a string
// Output: {"name":"Mario","lives":3,"active":true}
const json = {
    name: "Mario",
    lives: 3,
    active: true,
};

const jsonString = JSON.stringify(json);


// Serializing GVariant to a string
// Output: {'name': <'Mario'>, 'lives': <uint32 3>, 'active': <true>}
const variant = new GLib.Variant('a{sv}', {
    name: GLib.Variant.new_string('Mario'),
    lives: GLib.Variant.new_uint32(3),
    active: GLib.Variant.new_boolean(true),
});

const variantString = variant.print(true);
```

Compared to JSON, GVariant has the benefit of being strongly typed, with the
ability to serialize special values like file handles. GVariant serves as a
reliable and efficient format a number of places in the GNOME Platform
including GDBus, GSettings, GAction, GMenu and others.


## Basic Usage

Standard usage of GVariant is very straight-forward. You can use the constructor
methods like `GLib.Variant.new_string()` to create new `GLib.Variant` objects
and the instance methods like `GLib.Variant.prototype.get_string()` to extract
their values.

Below are some examples of some the standard functions in GLib for working with
`GLib.Variant` objects:

```js
const GLib = imports.gi.GLib;

// Simple types work pretty much like you expect
const variantBool = GLib.Variant.new_boolean(true);

if (variantBool.get_type_string() === 'b')
    print('Variant is a boolean!');

if (variantBool.get_boolean() === true)
    print('Value is true!');
    
    
// NOTE: As of GJS v1.68 all numeric types are still `Number` values, so some
// 64-bit values may not be fully supported. `BigInt` support to come.
const variantInt64 = GLib.Variant.new_int64(-42);

if (variantInt64.get_type_string() === 'x')
    print('Variant is an int64!');

if (variantInt64.get_int64() === -42)
    print('Value is -42!');
    

// NOTE: GLib.Variant.prototype.get_string() returns the value and the length
const variantString = GLib.Variant.new_string('a string');
const [strValue, strLength] = variantString.get_string();

if (variantString.get_type_string() === 's')
    print('Variant is a string!');

if (variantString.get_string()[0] === 'a string')
    print('Success!');


// List of strings are also straight forward
const stringList = ['one', 'two'];
const variantStrv = GLib.Variant.new_strv(stringList);

if (variantStrv.get_type_string() === 'as')
    print('Variant is an array of strings!');

if (variantStrv.get_strv().every(value => stringList.includes(value)))
    print('Success!');
```

If you ever get stuck trying to figure out how exactly a variant is packed,
there are some helpful functions you can use to debug. Check the documentation
for more.

```js
// Expected output here is: "{'key1': <'string'>, 'key2': <true>}"
print(deepDict.print(true));

// Expected output here is: "a{sv}"
print(deepDict.get_type_string());
```


## Packing Variants

In addition to the constructor methods in GLib, you can construct `GLib.Variant`
objects with the `new` keyword by passing a type string, followed by the values.
The [GVariant Format Strings][gvariant-format] page thoroughly describes the
types and their string representations.

```js
// This example is equivalent to the one above; both create a GVariant type `as`
const stringList = ['one', 'two'];
const variantStrv = new GLib.Variant('as', stringList);

if (variantStrv.get_type_string() === 'as')
    print('Variant is an array of strings!');

if (variantStrv.get_strv().every(value => stringList.includes(value)))
    print('Success!');
```

This method makes creating complex variants much easier including arrays (`[]`),
dictionaries (`a{sv}`) and tuples (`()`). Note that JavaScript has no tuple
type, so they are packed and unpacked as `Array`.

```js
// Below is an example of a libnotify notification, ready to be sent over DBus
const notification = new GLib.Variant('(susssasa{sv}i)', [
    'gjs.guide Tutorial',
    0,
    'dialog-information-symbolic',
    'Notification Title',
    'Notification Body',
    [],
    {},
    -1
]);

// Here is another complex variant, showing how child values marked `v` have to
// be packed like other variants.
const variantTuple = new GLib.Variant('(siaua{sv})', [
    'string',                               // a string
    -1,                                     // a signed integer
    [1, 2, 3],                              // an array of unsigned integers
    {                                       // a dictionary of string => variant
      'code-name': GLib.Variant.new_string('007'),
      'licensed-to-kill': GLib.Variant.new_boolean(true)
    }
]);

// Dictionaries with shallow, uniform value types can be packed in a single step
const shallowDict = new GLib.Variant('a{ss}', {
    'key1': 'value1',
    'key2': 'value2'
});

// Dictionaries with a varying value types use `v` and must be packed
const deepDict = new GLib.Variant('a{sv}', {
    'key1': GLib.Variant.new_string('string'),
    'key2': GLib.Variant.new_boolean(true)
});
```


## Unpacking Variants

GJS also has functions to make it easier to unpack `GLib.Variant` objects into
native values. `unpack()`, `deepUnpack()` and `recursiveUnpack()` will extract
the native values from `GLib.Variant` objects at various levels.

#### `unpack()`

`GLib.Variant.prototype.unpack()` is a useful function for unpacking a single
level of a variant.

```js
// Expected output here is: true
const variantBool = GLib.Variant.new_boolean(true);
print(variantBool.unpack());


// Note that unpack() is discarding the string length for us so all we get is
// the value. Expected output here is: "a string"
const variantString = GLib.Variant.new_string('a string');
print(variantString.unpack());


// In this case, unpack() is only unpacking the array, not the strings in it.
// Expected output here is:
//   [object variant of type "s"],[object variant of type "s"]
const variantStrv = GLib.Variant.new_strv(['one', 'two']);
print(variantStrv.unpack());
```

#### `deepUnpack()`

`GLib.Variant.prototype.deepUnpack()` will unpack a variant and its children,
but only up to one level.

```js
// Expected output here is:
//   "one","two"
const variantStrv = GLib.Variant.new_strv(['one', 'two']);
print(variantStrv.deepUnpack());


// Expected result here is:
//   {
//     "key1": "value1",
//     "key2": "value2"
//   }
const shallowDict = new GLib.Variant('a{ss}', {
    'key1': 'value1',
    'key2': 'value2'
});

const shallowDictUnpacked = shallowDict.deepUnpack();


// Expected result here is:
//   {
//     "key1": [object variant of type "s"],
//     "key2": [object variant of type "b"]
//   }
const deepDict = new GLib.Variant('a{sv}', {
    'key1': GLib.Variant.new_string('string'),
    'key2': GLib.Variant.new_boolean(true)
});

const deepDictUnpacked = deepDict.deepUnpack();
```

#### `recursiveUnpack()`

New in GJS 1.64 (GNOME 3.36) is `GLib.Variant.prototype.recursiveUnpack()`.
This function will unpack a variant and all its descendants.

Note that `GLib.Variant.prototype.recursiveUnpack()` will unpack all variants to
native values (ie. `Number`) so type information may be lost. You will have to
know the original types to repack those values.

```js
// Expected result here is:
//   {
//     "key1": "string",
//     "key2": true
//   }
const deepDict = new GLib.Variant('a{sv}', {
    'key1': GLib.Variant.new_string('string'),
    'key2': GLib.Variant.new_boolean(true)
});

const deepDictFull = deepDict.recursiveUnpack();
```


## DBus and GVariant

Since the variant format is foundational to DBus, there are two things you
should take note of:

1. Whether it's a **method**, **property** or **signal** the `GVariant` will
   always be a tuple (`()`).

2. [There is no `null` type supported in DBus][dbus-null], so you have to use
   either empty types or another alternative.
   
Below are a few example of working with `GLib.Variant` with DBus:

```js
const {GLib, Gio} = imports.gi.GLib;


// This method takes three arguments. Remember that JavaScript has no tuple
// type so we're using an Array instead.
const parameters = new GLib.Variant('(ssa{sv})', [
    'some-extension@someone.github.io',
    '',
    new GLib.Variant('a{sv}', {}),
]);

// This method has no return value, so the reply variant will be an empty tuple.
// You can also use this pattern to workaround the lack of `null` type in DBus.
const emptyReply = Gio.DBus.session.call_sync(
    'org.gnome.Shell',
    '/org/gnome/Shell',
    'org.gnome.Shell.Extensions',
    'OpenExtensionPrefs',
    parameters, // The method arguments
    null,       // The expected reply type
    Gio.DBusCallFlags.NONE,
    -1,
    null
);


// This method takes no arguments. For convenience you can pass `null` instead
// of an empty tuple.
//
// This method returns a value. You may pass `GLib.VariantType` if you want the
// return value automatically type-checked.
const reply = Gio.DBus.session.call_sync(
    'org.gnome.Shell',
    '/org/gnome/Shell',
    'org.gnome.Shell.Extensions',
    'ListExtensions',
    null,                                // The method arguments
    new GLib.VariantType('(a{sa{sv}})'), // The expected reply type
    Gio.DBusCallFlags.NONE,
    -1,
    null
);

// We know the first and only child of the tuple is the actual return value
const value = reply.get_child_value(0);

// Now we can unpack our value
const extensions = value.recursiveUnpack();
```


## GSettings and GVariant

`GVariant` is the storage and data exchange format for [`GSettings`][gsettings].
Applications in Flatpak will typically use keyfiles with values serialized to
string, while others use dconf which serialize to a binary format.

The [`GLib.VariantType`][gvariant-type] for each GSetting is declared in the 
`GSettingsSchema` file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<schemalist>
  <schema path="/guide/gjs/gvariant/" id="guide.gjs.GVariant">

    <!-- Simple types are most common in GSettings -->
    <key name="boolean-setting" type="b">
      <default>true</default>
    </key>

    <!-- Notice default values are in the GVariant Text format -->
    <key name="string-setting" type="s">
      <default>"default string"</default>
    </key>
    
    <key name="strv-setting" type="as">
      <default>["one", "two"]</default>
    </key>

    <!-- More complex types are possible, but rare -->
    <key name="complex-setting" type="(sasa{sa{sv}})">
      <default>("", [], {})</default>
    </key>
  </schema>
</schemalist>
```

`Gio.Settings` objects have convenient functions for unpacking and retrieving
common value types, while the rest can be handled manually:

```js
const {GLib, Gio} = imports.gi.GLib;


const settings = new Gio.Settings({schema_id: 'guide.gjs.GVariant'});

// Simple types are easy to work with
const boolValue = settings.get_boolean('boolean-setting');
settings.set_boolean('boolean-setting', !boolValue);

const stringValue = settings.get_string('string-setting');
settings.set_string('string-setting', 'a different string');

const strvValue = settings.get_strv('strv-setting');
settings.set_strv('strv-setting', strvValue.concat('three'));

// Complex types can be handled manually
const complexVariant = settings.get_value('complex-setting');
const complexValue = complexVariant.recursiveUnpack();

const newComplexValue = GLib.Variant('(sasa{sa{sv}})', [
    '',
    [],
    {},
]);
settings.set_value('complex-setting', newComplexValue);
```


## See also

* [GVariant Format Strings][gvariant-format]
* [GVariant Text Format][gvariant-text]
* [GVariant Type][gvariant-type]


[gsettings]: https://developer.gnome.org/gio/stable/GSettings.html
[gvariant]: https://gjs-docs.gnome.org/#q=glib.variant
[gvariant-format]: https://docs.gtk.org/glib/gvariant-format-strings.html
[gvariant-text]: https://docs.gtk.org/glib/gvariant-text.html
[gvariant-type]: https://gjs-docs.gnome.org/glib20/glib.varianttype
[dbus-null]: https://gitlab.freedesktop.org/dbus/dbus/issues/25

