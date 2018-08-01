---
title: Widgets and Other GTK+ Objects
---

# Widgets in GTK+

For a list of all widgets in GTK+ go [here]();

## Signals

Remember from 1.3, GTK+ is event-driven. When input is received by any GTK+ widget an action may be performed. *Signals* allow us to create custom actions. GTK+ widgets communicate input by sending out a *signal* which contains data about that input. You can listen for these signals and perform custom actions.

A standard example of listening to a signal would be:

```js
button.connect('clicked', () => {
    log('The button was clicked'!);
});
```

In this example we call the `connect()` function on an already created `button` (we'll learn how to create buttons later). `connect()` takes two arguments the signal name - in this case `'clicked'` - and a callback.
We're using an [arrow function]() to provide the callback. Every time this button is clicked a message will appear in the log saying `'The button was clicked'`.

*Concepts utilized in this example: [`this` in Closures](), [Logging in GJS](), [Strings in GJS]()*

## Widget Properties

In GTK+ ever widget has properties. A `Gtk.Button` has a `label` property representing the text inside the button, a `Gtk.Image` has a `iconName` property representing the icon it is showing. You can find a list of the properties of any widget in the *Properties* section of the widget's page on [DevDocs](). 

### Getting Properties

To access a property of a widget retrieve the value at the the property name in *lowerCamelCase* in the widget object.

A few simple examples:

```js
let iconName = image.iconName;
let buttonText = button.text;
```

*`image` and `button` are instances of `Gtk.Image` and `Gtk.Button` respectively*

### Setting Properties

To set the property of a widget use the provided setter function if available and, if not, set the value on the widget object.

A few simple examples:

```js
button.set_label('Hello!');

/* or */

widget.someProp = 10;
```

*`button` is an instance of `Gtk.Button`. `widget` represents some widget with the property `someProp` which does not have a `set_some_prop()` function.*


