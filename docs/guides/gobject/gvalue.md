---
title: GValue
---

# GValue

[`GObject.Value`][gvalue] is a generic value container, usually only used to implement [GObject Properties](basics.md#properties) in projects written with the C programming language. By storing the value type alongside the value, it allows for dynamic type features usually not available to C programmers.

In JavaScript, this behaviour is part of the language (i.e. `typeof`) and GJS will usually convert them automatically, but there are some situations that require using `GObject.Value` directly.

[gvalue]: https://gjs-docs.gnome.org/gobject20/gobject.value

## Basic Usage

Before a newly created GValue can be used, it must be initialized to hold a specific [GType](gtype.md#type-constants):

```js
const {GObject} = imports.gi;


// Create a new GValue
let value = new GObject.Value();

// Initialize it to hold a boolean
value.init(GObject.TYPE_BOOLEAN);
```

Although you should always use native JavaScript accessors for properties, the property methods can be used to demonstrate how to work with GValue:

```js
const {GObject, Gio} = imports.gi;


const action = new Gio.SimpleAction({
    name: 'test',
    enabled: false,
});


// Create a new boolean GValue
const booleanValue = new GObject.Value();
booleanValue.init(GObject.TYPE_BOOLEAN);


// Set the GValue from a property
action.get_property('enabled', booleanValue);

// Check the result
if (booleanValue.get_boolean())
    log(`${action.name} is enabled`);
else
    log(`${action.name} is disabled`);
    
    
// Set the GValue 
booleanValue.set_boolean(true);

// Set the property from the GValue
action.set_property('enabled', booleanValue);
```

## Type Safety

The type of an existing `GObject.Value` can be checked by calling [`GObject.type_check_value_holds()`][gvalue-check]:

```js
const {GObject, Gio} = imports.gi;


const booleanValue = new GObject.Value();
booleanValue.init(GObject.TYPE_BOOLEAN);

if (GObject.type_check_value_holds(booleanValue, GObject.TYPE_BOOLEAN)
    log('GValue initialized to hold boolean values');
    
if (!GObject.type_check_value_holds(booleanValue, GObject.TYPE_STRING)
    log('GValue not initialized to hold string values');
```

[gvalue-check]: https://gjs-docs.gnome.org/gobject20/gobject.type_check_value_holds

