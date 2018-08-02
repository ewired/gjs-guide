---
title: Loading User Interface Files In GJS
date: 2018-07-25 16:10:11
---

# Loading User Interface Files In GJS

The user interface file you have created, `window.ui`, is a template for your application. To use this template and its widgets we need to load it. 

*Before you continue make sure you've read [Extending GObject Classes in GJS]()*

## Loading the template

Luckily, in GJS it is quite simple to load a user interface template.

```js
/* imports */
var X = GObject.registerClass({
    Template: 'url://templateurl'
}, class X extends Gtk.ApplicationWindow {
    /* implementation */
});
}
```

You will find the above code in your project's `window.js` file. This code tells GTK+ to register the class and apply a GTK+ user interface template to it.

## Registering template widgets

We now have the template, but how do we access the widgets?

Before we had variables like this:

```js
const button = new Button();
button.do_something();
```
So it was easy to call functions and manipulate the button. To achieve a similar system with templates you have to tell GTK+ what widgets you want to use by passing a list of their IDs to `InternalChildren`.

```js
/* imports */
GObject.registerClass({
    Template: 'url://templateurl',
    InternalChildren: ['button']
}, class X extends GObject.Object {
    /* implementation */
});
```

## Accessing template children

Now you can access the button like this:

```js
this._button.do_something();
```

All template widgets listend in `InternalChildren` are accessible with the pattern `this._[childName]`.

_Note the prefixed underscore!_
