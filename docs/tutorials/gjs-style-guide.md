---
title: Style Guide
date: 2018-07-25 16:10:11
---
# GJS Coding Style

Our goal is to have all JavaScript code in GNOME follow a consistent style. In a dynamic language like
JavaScript, it is essential to be rigorous about style (and unit tests), or you rapidly end up
with a spaghetti-code mess.

## Semicolons

While JavaScript allows omitting semicolons at the end of lines,we do not. Always end statements with a semicolon.

## Imports

Always use **CamelCase** when importing modules and classes to distinguish them from other variables.

```js
const Big = imports.big;
const GLib = imports.gi.GLib;
```

## Variable declaration

Always use one of `const`, `let`, or `var` when defining a variable. Always use `let` when block scope is intended; in particular, inside `for()` and `while()` loops, `let` is almost always correct.

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

## `this` in closures ##

`this` will not be captured in a closure; `this` is relative to how the closure is invoked, not to the value of this where the closure is created, because `this` is a keyword with a value passed in at function invocation time, it is not a variable that can be captured in closures.

To solve this, use `Function.prototype.bind()` or fat arrow functions:

```js
let closure = function() { this._fnorbate() }.bind(this);
// or
let closure = () => { this._fnorbate(); };
```

A more realistic example would be connecting to a signal on a
method of a prototype:

```js
MyPrototype = {
    _init : function() {
       fnorb.connect('frobate', this._onFnorbFrobate.bind(this));
    },

    _onFnorbFrobate : function(fnorb) {
       this._updateFnorb();
    },
};
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

## Variable naming ##

- We use javaStyle variable names, with CamelCase for type names and lowerCamelCase for variable and method names. However, when calling a C method with underscore-based names via introspection, we just keep them looking as they do in C for simplicity.
- Private variables, whether object member variables or module-scoped variables, should begin with `_`.
- True global variables (in the global or 'window' object) should be avoided whenever possible. If you do create them, the variable name should have a namespace in it, like `BigFoo`
- When you assign a module to an alias to avoid typing `imports.foo.bar` all the time, the alias should be `const TitleCase` so `const Bar = imports.foo.bar;`
- If you need to name a variable something weird to avoid a namespace collision, add a trailing `_` (not leading, leading `_` means private).
- For GObject constructors, always use the `lowerCamelCase` style for property names instead of dashes or underscores.

## Whitespace ##

* 4-space indentation (the Java style)
* No trailing whitespace.
* No tabs.
* If you `chmod +x .git/hooks/pre-commit` it will not let you commit with messed-up whitespace (well, it doesn't catch tabs. turn off tabs in your text editor.)

## JavaScript attributes ##

Don't use the getter/setter syntax when getting and setting has side effects, that is, the code:
```js
foo.bar = 10;
```
should not do anything other than save "10" as a property of `foo`. It's obfuscated otherwise; if the setting has side effects, it's better if it looks like a method.

In practice this means the only use of attributes is to create read-only properties:
```js
get bar() {
    return this._bar;
}
```

If the property requires a setter, or if getting it has side effects, methods are probably clearer.

[1] http://developer.mozilla.org/en/docs/index.php?title=New_in_JavaScript_1.7&printable=yes#Block_scope_with_let

## Tips

- If using Emacs, try js2-mode. It functions as a "lint" by highlighting missing semicolons and the like.