---
title: Intro
date: 2018-07-25 16:10:11
---
# GNOME Javascript Introduction

Welcome to GNOME Javascript (GJS)! This first page details key differences from other Javascript frameworks you've used in the past.


## Imports and Modules

In GJS every file is treated as a "module" and any variable declared as using 'var' (or global scope) is exported. Each "module" is imported using the 'imports' object using the pattern imports.[fileName] where the file's literal name is fileName.js. If your fileName contains a character that is not a valid Javascript identifier you can access it using the object+key syntax: object['fileName'].

#### a.js:
<code>var A = class A { }
</code>

#### b.js:
| Standard Syntax | Quick Object Syntax |
|-----------------|---------------------|
|<code>const A = imports.a;<br/>let a = new A.A();</code>|<code>const { A } = imports.a;<br/>let a = new A();</code>|

Modules are searched in paths defined in the array `imports.searchPath`. You can modify the value of `imports.searchPath` to include the directories where to look for modules.

## Import Versioning

### In A GTK+ Application

Use `pkg.require({})` !!

### Elsewhere

Use `imports.gi.Versions.Gtk = X;` !!

## Logging

`console` is not defined in GJS, for basic logging use the built-in function `log(message)`

## Extending GObject Classes

GJS supports native ES6 classes but requires a few changes to any class that extends from a GObject class (a subclass of a GTK+ widget or of a GLib class for instance). 

|Standard ES6 Class|GObject Subclass|
|-|-|
|<code>var A = class A extends B {<br />&nbsp;&nbsp;&nbsp;&nbsp;constructor(x, y){<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super(x);<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.y = y;<br />&nbsp;&nbsp;&nbsp;&nbsp;}<br />}</code>|<code>var A = GObject.registerClass(<br/>&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GTypeName: 'A',<br/>&nbsp;&nbsp;&nbsp;&nbsp;}, <br/>&nbsp;&nbsp;&nbsp;&nbsp;class A extends GObject.Object {<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_init(x, y) {<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super._init(x);<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.y = y;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>);</code>
