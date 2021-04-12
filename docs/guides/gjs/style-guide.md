---
title: Style Guide
---
# GJS Style Guide

This guide represents the official coding style of GJS and all official GNOME projects which utilize GJS.

The goal of this guide is to provide a flexible, balanced JavaScript syntax for all projects, GNOME or otherwise, which utilize our platform.

In an amazing, dynamic language like JavaScript, a correct style guide (and unit tests) are critical or your codebase rapidly becomes a spaghetti-code mess.

## Rule List
[[toc]]

## Semicolons

While JavaScript allows omitting semicolons at the end of lines, we do not. Always end statements with a semicolon.

## Variable naming ##

- We use *CamelCase* variable names, with CamelCase for type names and lowerCamelCase for variable, property, and method names.
- Private variables, whether object member variables or module-scoped variables, should begin with `_`.
- Global variables (in the global or 'window' object) should be avoided whenever possible. If you do create them, the variable name should have a namespace.
<!-- DISCUSS - If you are need to name a variable something weird to avoid a namespace collision, add a trailing `_` (not leading, leading `_` means private). -->

## Imports

1. Always use **CamelCase** when importing modules and classes to distinguish them from other variables.

   ```js
   const Lang = imports.lang;
   ```
2. Use quick object syntax when importing multiple classes from one source.

   ```js
   const { GLib, GObject } = imports.gi;
   const Lang = imports.lang;
   ``` 
3. Always separate library imports from local imports.
   
   ```js
   const { GLib, GObject } = imports.gi;
   const Lang = imports.lang;

   const LocalClass = imports.localClass;
   ``` 

## Variable declaration

Always use one of `const`, `let`, or `var` when defining a variable. Always use `let` when block scope is intended; in particular, inside `for()` and `while()` loops, `let` or `const` is almost always correct.

### `var`

`var` declares variables at the beginning of the closest function, module, or script, regardless of where the declaration occurs.
`var` should be used with caution and typically only when you need to export a variable to other modules. *Never use `var` in `while` or `for` loops.*

### `const` vs. `let`

`const` and `let` both ensure that variables are only accessible *after* they are declared in the code. `const` should always be used *unless* you absolutely need to change the variable value. This prevents bugs from accidental reassignments.

Examples:

```js


/* Iterating over any iterable object (Array, etc)
 * This is valid because the logic of this loop is:
 * { const prop = someobj[0]; ~your code~ }
 * { const prop = someobj[1]; ~your code~ }
 */
for (const prop of someobj) {
  ...
}

// vs.

/* Using an actual counter which logically functions as...
 *  let i = 0;
 *  if (i < 10) ~your code~
 *  i++;
 *  if (i < 10) ~your code~
 *  i++;
 */
for (let i = 0; i < 10; i++) {
  ...
}

```

If you don't use `let`/`const` then the variable is added to function scope, not the for loop block scope.
See [What's new in JavaScript 1.7][1]

A common case where this matters is when you have a closure inside a loop:
```js
for (const i = 0; i < 10; ++i) {
  mainloop.idle_add(() => {
    log(`Printing i: ${i}`);
  });
}
```

If you used `var` instead of `const` it would print "10" numerous times.

## GObject Properties

::: warning
These rules only apply to GObject properties!
:::

GJS provides numerous ways to access properties on GObject classes.we recommend using `camelCase` for getting properties and utilizing the provided setter function instead of setting the property directly.

1. ### Use **lowerCamelCase** when getting or setting a simple property

   #### Getting a property value

   ```js
   /* incorrect */
   let a = obj['property-name'];

   /* incorrect */
   let b = obj.property_name;

   /* correct */
   let c = obj.propertyName;
   ```

   #### Setting a property value

   ```js
   /* incorrect */
   obj['property-name'] = 10;

   /* incorrect */
   obj.property_name = 10;

   /* correct */
   obj.propertyName = 10;
   ```

2. ### Use the `C` setter function when setting a property *that has side effects*

   If setting the property causes change beyond simply changing the value, prefer the setter function for clarity.

   ```js
   /* incorrect */
   obj['property-name-has-side-effects'] = 10;

   /* incorrect */
   obj.property_name_has_side_effects = 10;

   /* incorrect */
   obj.propertyNameHasSideEffects = 10;

   /* correct */
   obj.set_property_name_has_side_effects(10);
   ```

## JavaScript Properties

Do not use JavaScript's getter and setter syntax if your code has side effects.

For example, the code `foo.bar = 10;` should not do anything other than set `foo.bar` to `10`. If the setting has side effects use a setter method:

```js
function setBar(value) {
  this._bar = value;
}
```

The same logic applies to getters.

In practice, this means getters are only used to make internal properties public or for creating static properties on the object.

```js
class Demo {
    get bar() {
        return this._bar;
    }

    /* and */

    static get bar() {
        return 'bar?';
    }
}

const demo = new Demo();
let staticBar = Demo.bar;
let bar = demo.bar;
```


## `this` in closures

`this` will not be captured in a closure; `this` is relative to how the closure is invoked, not to the value of this where the closure is created, because `this` is a keyword with a value passed in at function invocation time, it is not a variable that can be captured in closures.

To solve this, use [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) or `Function.prototype.bind()`:

```js
let closure = () => { 
  this._fn(); 
};
// or
let closure = function() { 
  this._fn();
}.bind(this);
```

An example of this would be connecting to a signal on a GObject:

```js
const { Gtk } = imports.gi;

const button = new Gtk.Button({ label: 'Click Me!' });
button.connect('clicked', () => {
  /* do something */
});
```

## Object literal syntax ##

JavaScript allows equivalently:
```js
foo = { 'bar' : 42 };
foo = { bar: 42 };
```
and
```js
var b = foo['bar'];
var b = foo.bar;
```

If your usage of an object is like an object, then you're defining "member variables." For member variables, use the no-quotes no-brackets syntax, that is, `{ bar: 42 }` and `foo.bar`.

If your usage of an object is like a hash table (and thus conceptually the keys can have special chars in them), don't use quotes, but use brackets, `{ bar: 42 }`, `foo['bar']`.

## Whitespace

### General Rules

* 4-space indentation (the Java style)
* No trailing whitespace.
* No tabs.

### No whitespace when calling a function.
*eslint: func-call-spacing*

```js
/* very incorrect */
fn
();

/* incorrect */
fn ();

/* perfect */
fn();
```

### No spaces between brackets and elements.
*eslint: array-bracket-spacing*

```js
/* incorrect */
let arr = [ 1, 2, 3 ];

/* correct */
let arr = [1, 2, 3];
```

### Spacing in a function signature.
*eslint: space-before-function-paren, space-before-blocks*

```js

```

### Enforce spacing between keys and values in object literal properties.
*eslint: key-spacing*

```js
/* incorrect */
const objA = { foo:42 };
const objB = { foo : 42 };
const objC = { foo :42 };

/* correct */
var obj = { foo: 42 };

/* incorrect */
const a = function (){};
const b = function (){};
const c = function(){};

/* correct */
const d = function() {};
const e = function a() {};

/* incorrect */
const arr = [ 1, 2, 3 ];
log(arr[ 0 ]);

/* correct */
const foo = [1, 2, 3];
log(foo[0]);
```

### Use spaces inside curly braces.
*eslint: object-curly-spacing*

```js
/* incorrect */
const foo = {clark: 'kent'};

/* correct */
const foo = { clark: 'kent' };
```
