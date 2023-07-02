---
title: Actions and Menus
---

# Actions and Menus

`Gio.Action` is a high-level interface used throughout the GNOME platform,
especially in GTK. Actions can provide a similar, but simpler interface to
functionality such as methods or properties. They can be used by widgets,
desktop notifications, menus or even remotely via D-Bus.

`Gio.MenuModel` is a related API, used to describe a menu structure with
sections, submenus and items. In the case of GTK, menu models can provide the
structure and presentation for `Gio.Action`. While actions are purely
functional, menu items can have labels, icons and map stateful actions to
elements like checkboxes and radio buttons

[dbus]: https://dbus.freedesktop.org/
[gvariant]: https://gjs-docs.gnome.org/glib20/glib.variant
[dspy]: https://flathub.org/apps/details/org.gnome.dspy
[gnome-builder]: https://flathub.org/apps/details/org.gnome.Builder

**Related Guides**

* [D-Bus Guide](/guides/gio/dbus.html)
* [GVariant Guide](/guides/glib/gvariant.html)

**GNOME Developer Documentation**

* [Actions](https://developer.gnome.org/documentation/tutorials/actions.html)
* [Menus](https://developer.gnome.org/documentation/tutorials/menus.html)


## GAction

[`Gio.Action`][gaction] is a GObject Interface that can be implemented by any
object, but you will almost always use [`Gio.SimpleAction`][gsimpleaction].
There are two fundamental types of actions, activatable and stateful, which will
only succeed if [`Gio.Action.get_enabled()`][gaction-getenabled] returns `true`.

Although they can be used by themselves, actions are intended to be grouped
together, either by scope (e.g. `app.quit` and `window.close`) or by context
(e.g. `clipboard.copy` and `clipboard.paste`). This makes them good alternatives
to signal handlers for widgets and menus, as well as export over D-Bus.

[gaction]: https://gjs-docs.gnome.org/gio20/gio.action
[gaction-getenabled]: https://gjs-docs.gnome.org/gio20/gio.action#method-get_enabled
[gsimpleaction]: https://gjs-docs.gnome.org/gio20/gio.simpleaction

### Activatable Actions

Activatable actions operate much like functions, but have no return value. They
may have a parameter (i.e. arguments) of any type, or none at all. They have no
means to report the success of an activation.

`Gio.SimpleAction` implements `Gio.Action.activate()` by emitting an `activate`
signal. If the signal has a handler connected, it will be passed the parameter,
otherwise if the action is stateful it will attempt to change the value.

@[code js](@src/guides/gio/actions-and-menus/gactionActivatable.js)

### Stateful Actions

::: tip
Depending on the implementation, stateful actions may also act on calls to
`Gio.Action.activate()`. Consult the documentation for details.
:::

Stateful actions operate similar to object properties. Depending on how
[`Gio.Action.change_state()`][gaction-changestate] is implemented, the state of
an action may be read-write, read-only, or conditional depending on its value.
Implementations may use [`Gio.Action.get_state_hint()`][gaction-getstatehint] to
validate a state change, although there are no guarantees how the hint may be
interpreted.

`Gio.SimpleAction` implements state changes by emitting a `change-state` signal
to allow validating the new value. If the signal has a handler connected, it
can decide whether to call `Gio.SimpleAction.set_state()`, otherwise it will
be called unconditionally.

@[code js](@src/guides/gio/actions-and-menus/gactionStateful.js)

[gaction-changestate]: https://gjs-docs.gnome.org/gio20/gio.action#method-change_state
[gaction-getstatehint]: https://gjs-docs.gnome.org/gio20/gio.action#method-get_state_hint

### Specialized Actions

[`Gio.PropertyAction`][gpropertyaction] is a stateful action, which is created
from and bound to a [GObject Property][gobject-property]. Only read-write
properties with basic types are supported, including:

* `GObject.TYPE_BOOLEAN`
* `GObject.TYPE_INT32`
* `GObject.TYPE_UINT32`
* `GObject.TYPE_DOUBLE`
* `GObject.TYPE_FLOAT`
* `GObject.TYPE_STRING`
* Enumerations, which are available as a string

The property value is not stored in the `Gio.Action`, but instead forwarded by
property notifications as state changes:

@[code js](@src/guides/gio/actions-and-menus/gactionProperty.js)

GSettings also has a convenient method for creating actions bound to a settings
value. Boolean settings (i.e. `b`) will become an activatable action, which is
toggled when activated, while all other types are stateful with the same type
as the given key.

@[code js](@src/guides/gio/actions-and-menus/gactionSettings.js)

[gobject-property]: ../gobject/basics.md#property
[gpropertyaction]: https://gjs-docs.gnome.org/gio20/gio.propertyaction

### Action Groups

Actions are usually managed by objects that implement the
[`Gio.ActionGroup`][gactiongroup], and possibly [`Gio.ActionMap`][gactionmap]
interfaces. [`Gio.Application`][gapplication] implements both interfaces, as
does [`Gio.SimpleActionGroup`][gsimpleactiongroup].

When activated via a group, as opposed to calling `Gio.Action.activate()`
directly, parameters may be passed as a "detail". For string parameters with
only alpha-numeric characters, periods and hyphens, this is as simple as
`actionName::string-value`. Other types may be passed in the form of a
serialized GVariant such as `actionName('string-!@#$%^&*')` and `actionName(5)`.
This will be very convenient when working with `Gio.MenuModel`.

@[code js](@src/guides/gio/actions-and-menus/gactionGroup.js)

`Gio.Application`, including subclasses like `Gtk.Application` and
`Adw.Application`, is the preferred group for application-wide actions such as
`quit` and `about`. All of the same methods and signals may be used on the
application instance, just like `Gio.SimpleActionGroup`.

@[code js](@src/guides/gio/actions-and-menus/gactionApplication.js)

[gactiongroup]: https://gjs-docs.gnome.org/gio20/gio.actiongroup
[gactionmap]: https://gjs-docs.gnome.org/gio20/gio.actionmap
[gapplication]: https://gjs-docs.gnome.org/gio20/gio.application
[gsimpleactiongroup]: https://gjs-docs.gnome.org/gio20/gio.simpleactiongroup

## GMenu

::: tip
It's also possible to define menu models in `Gtk.Builder` XML, but only the
programmatic API will be demonstrated here.
:::

[`Gio.MenuModel`][gmenumodel] is an abstract-base class (not an interface) for
defining structured menus with items, sections and submenus. The provided
implementation for the platform is [`Gio.Menu`][gmenu].

Unlike `Gio.Action`, menu models contain presentation information like labels
and icon names. In most cases, actions provide the functionality for menus,
while menus often act as the presenter of groups of actions.

[gmenu]: https://gjs-docs.gnome.org/gio20/gio.menu
[gmenumodel]: https://gjs-docs.gnome.org/gio20/gio.menumodel

### Menu Items

::: tip NOTE
`Gio.MenuItem` objects are immutable, meaning that once added to a menu any
changes to the items will not change the item in the model.
:::

Menu items can take several forms, aside from the standard item type which
corresponds to a standard activatable GAction. In particular, activatable
boolean types (i.e. `b`) become checkbox menu items, and stateful string types
and enumerations (i.e. `s`) become radio buttons.

@[code js](@src/guides/gio/actions-and-menus/gmenuItem.js)

[gmenuitem]: https://gjs-docs.gnome.org/gio20/gio.menuitem

### Sections and Submenus

::: tip
Submenus should be used conservatively, as they can result in a confusing user
experience. See the [GNOME Human Interface Guidelines][gnome-hig] for tips.
:::

Menu sections are a way to logically and visually group items, while keeping
them in the same menu level. A common set of menu sections might include one
for *Preferences*, *Help* and *About*, with another for *Quit*.

Submenus are less common and often used to group items that follow logically
from a parent item. A common pattern is an *Open* item, which might have
sub-items such as *Open In New Tab*, *Open In New Window* and so on.

@[code js](@src/guides/gio/actions-and-menus/gmenuNested.js)

[gnome-hig]: https://developer.gnome.org/hig/patterns/controls/menus.html

### Consuming Menu Models

`Gio.MenuModel` emits [`Gio.MenuModel::items-changed`][gmenumodel-itemschanged]
an efficient way to track the membership of items, sections and submenus,
similar to `Gio.ListModel`.

@[code js](@src/guides/gio/actions-and-menus/gmenuModel.js)

Because the entries in a `Gio.MenuModel` may be nested, either as sections or
submenus, it may be necessary to iterate items. This is not typically something
you will want to do, but may help understand how menu models work.

@[code js](@src/guides/gio/actions-and-menus/gmenuIter.js)

[gmenumodel-itemschanged]: https://gjs-docs.gnome.org/gio20/gio.menumodel#signal-items-changed
