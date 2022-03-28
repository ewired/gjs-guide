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

`console` is not defined in GJS, for basic logging use the built-in function `log(message)`

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
        _init(x, y) {
            super._init(x);
            this.y = y;            
        }
    }
);
```
