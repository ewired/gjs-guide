---
title: Intro
date: 2018-07-25 16:10:11
---

# GNOME JavaScript Introduction

Welcome to GNOME JavaScript (GJS)! This first page details key differences from other JavaScript frameworks you've used in the past.

## Imports and Modules

In GJS every file is treated as a "module" and any variable declared as using 'var' (or global scope) is exported. Each "module" is imported using the 'imports' object using the pattern imports.[fileName] where the file's literal name is fileName.js. If your fileName contains a character that is not a valid JavaScript identifier you can access it using the object+key syntax: object['fileName'].

#### a.js:

```js
var A = class A {};
```

#### b.js:

Standard Syntax

```js
const A = imports.a;
let a = new A.A();
```

Quick Object Syntax

```js
const { A } = imports.a;
let a = new A();
```

Modules are searched in paths defined in the array `imports.searchPath`. You can modify the value of `imports.searchPath` to include the directories where to look for modules.

## Import Versioning

### In A GTK+ Application

Use `pkg.require({})`

### Elsewhere

Use `imports.gi.Versions.Gtk = X;`

## Logging

::: tip
Some distributions may require you to be part of a `systemd` user group to access logs. On systems that are not using `systemd`, logs may be written to `~/.xsession-errors`.
:::

GJS has a number of logging facilities, some particular to GJS, others inherited from JavaScript and a few that are provided by GLib. There is more complete documentation available for [Built-in Logging][logging-docs] and the [`console`][console-docs] suite of functions.

### `console` Functions

As of GJS 1.70 (GNOME 41), the `console` collection of functions are available as described in the [WHATWG Console Standard][console-standard]. The `console` object is available globally and should be familiar to those that have used JavaScript in web development.

Note that the `console` functions do not work with the `GNOME_SHELL_EXTENSION_UUID` feature, so if you rely on this you should use the built-in functions instead.

### Built-in Functions

GJS also has a number of built-in logging functions:

```js
// Log a string, usually to `journalctl`
log('a message');

// Log an Error() with a stack trace and optional prefix
try {
    throw new Error('An error occurred');
} catch (e) {
    logError(e, 'ExtensionError');
}

// Print a message to stdout
print('a message');

// Print a message to stderr
printerr('An error occured');
```

When writing extensions, `print()` and `printerr()` are not particularly useful since we won't have easy access to `gnome-shell`'s `stdin` and `stderr` pipes. Instead you will want use `log()` and `logError()` and watch the log in a new terminal with `journalctl`:

```sh
$ journalctl -f -o cat /usr/bin/gnome-shell
```

## Extending GObject Classes

GJS supports native ES6 classes but requires a few changes to any class that extends from a GObject class (a subclass of a GTK+ widget or of a GLib class for instance).

### Standard ES6 Class

```js
var A = class A extends B {
    constructor(x, y){
        super(x);
        this.y = y;
    }
}
```

### GObject Subclass

```js
var A = GObject.registerClass(
    {
        GTypeName: 'A',
    }, 
    class A extends GObject.Object {
        constructor(x, y) {
            super(x);
            this.y = y;            
        }
    }
);
```


[console-standard]: https://console.spec.whatwg.org/
[console-docs]: https://gjs-docs.gnome.org/gjs/console.md
[logging-docs]: https://gjs-docs.gnome.org/gjs/logging.md
