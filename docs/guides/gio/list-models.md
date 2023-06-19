---
title: List Models
---

# List Models

List models are a simple interface for ordered lists of `GObject` instances. It
has become the preferred method for populating list, grid and tree widgets. A
default implementation is provided, optimized for linear iteration.

GTK4 also includes additional `Gio.ListModel` implementations that can filter,
sort, flatten nested lists, and more. This guide focuses on the implementation
and usage of `Gio.ListModel`, primarily as introductory material for list view
widgets and others in GTK4.

**See Also**

* [GTK4: List Widget Overview](https://docs.gtk.org/gtk4/section-list-widget.html)
* [GObject Interfaces](/guides/gobject/interfaces.html)
* [GObject GType](/guides/gobject/gtype.html)


## Basic Implementation

::: tip NOTE
`Gio.ListModel` only works with types that inherit from `GObject.Object`, and
will not accept boxed types such as [`GObject.TYPE_JSOBJECT`][gtype-jsobject].
:::

[`Gio.ListModel`][glistmodel] defines a read-only interface, intended to be used
from a single thread. This makes implementation very simple, requiring only
three methods, and emitting one signal at the appropriate time.

1. `Gio.ListModel.get_item(position)`

   This method must return the `GObject.Object` at `position`, or `null` if an
   invalid position is passed. This allows easily iterating the list, without
   checking the length.

2. `Gio.ListModel.get_item_type()`

   This method must return a [GType](/guides/gobject/gtype.html) shared by all
   objects in the list. It may simply be `GObject.Object`, or any other common
   ancestor or `GObject.Interface` of the objects.

3. `Gio.ListModel.get_n_items()`

   This method must return the number of items in the list. More importantly,
   when [`Gio.ListModel::items-changed`][glistmodel-itemschanged] is emitted, it
   must return the current value.

The ordered nature of the `Gio.ListModel` interface also makes it easy to add
support for the [JavaScript Iterator][js-iterators] protocol. The best way to
demonstrate the list model API is to wrap one around an `Array` and expose the
elements:

@[code js](@src/guides/gio/list-models/listModel.js)

[glistmodel]: https://gjs-docs.gnome.org/gio20/gio.listmodel
[glistmodel-itemschanged]: https://gjs-docs.gnome.org/gio20/gio.listmodel#signal-items-changed
[gtype-jsobject]: (/guides/gobject/gtype.html#javascript-types)
[js-iterators]: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Iterators_and_Generators

## Basic Usage

### GListStore

`Gio.ListStore` is an implementation of `Gio.ListModel` suitable for common use
cases, with a fast-path for iterating the items sequentially. It's usually the
best choice for generic usage, and implements the JavaScript Iterator protocol
already.

@[code js](@src/guides/gio/list-models/listStore.js)

### Consuming List Models

Usually objects implementing `Gio.ListModel` are bound to widget with a
convenience function, or wrapped in another model like
[`Gtk.SelectionModel`][gtk-selectionmodel] and used to populate a widget like
[`Gtk.ListView`][gtk-listview].

However, it's helpful to understand how these widgets will typically use list
models,  when first using widgets that consume list models, to
understand how these widgets will use the model internally.

@[code js](@src/guides/gio/list-models/basicUsage.js)

[gtk-listview]: https://gjs-docs.gnome.org/gtk40/gtk.listview
[gtk-selectionmodel]: https://gjs-docs.gnome.org/gtk40/gtk.selectionmodel

