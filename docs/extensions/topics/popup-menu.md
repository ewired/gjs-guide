---
title: Popup Menu
---

# Popup Menu

The [`PopupMenu`][js-popupmenu] module contains classes for creating popup menus
in GNOME Shell. Extension authors often use these with panel buttons and
[Quick Settings](quick-settings.html).

[js-popupmenu]: https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/main/js/ui/popupMenu.js


## Menu Items

### `Ornament`

Most menu items can have ornaments on them. These are small indicators placed
before the content of an item, such as a check mark.

* `PopupMenu.Ornament`
    * `PopupMenu.Ornament.NONE` — No ornament
    * `PopupMenu.Ornament.DOT` — A small dot (e.g. radio button)
    * `PopupMenu.Ornament.CHECK` — A check mark
    * `PopupMenu.Ornament.HIDDEN` — Hides the ornament, lets the content expand

### `PopupBaseMenuItem`

There are several types of menu items, all derived from the abstract base-class
`PopupBaseMenuItem`. This class cannot be created by itself, but contains a
number of methods, properties and signals common to all items.

#### Methods

* `new PopupBaseMenuItem(params)` — Constructor
    * params (`Object`) — Additional item properties
        * activate (`Boolean`) — Whether the item can be activated (default: `true`)
        * can_focus (`Boolean`) — Whether the item can be focused (default: `true`)
        * hover (`Boolean`) — Whether the item responds to the pointer being
            hovered over it (default: `true`)
        * reactive (`Boolean`) — Whether the item is sensitive (default: `true`)
        * style_class (`String`) — Additional CSS classes for the item (all
            items have the `popup-menu-item` class)
* `activate(event)` — Emits the `activate` signal on the item
    * event (`Clutter.Event`) — The event [`Clutter.Event`][clutterevent] to
        emit
* `setOrnament(ornament)` — Sets the ornament for the item
    * ornament (`PopupMenu.Ornament`) — A [`PopupMenu.Ornament`](#ornament)

[clutterevent]: https://gjs-docs.gnome.org/clutter10/clutter.event

#### Properties

* `active` (`Boolean`) — Whether the item is selected or hovered (read-write)
* `sensitive` (`Boolean`) — Whether the item can be selected and activated
    (read-write)
    
#### Signals

* `activate(item, event)` — Emitted when the item is activated
    * item (`PopupMenu.PopupBaseMenuItem`) — The emitting object
    * event (`Clutter.Event`) — The current [`Clutter.Event`][clutterevent]
    
[clutterevent]: https://gjs-docs.gnome.org/clutter10/clutter.event
    
#### Example

```js
const Clutter = imports.gi.Clutter;
const PopupMenu = imports.ui.popupMenu;

// PopupMenuItem is a subclass of PopupBaseMenuItem
const menuItem = new PopupMenu.PopupMenuItem('Item Label', {
    active: false,
    can_focus: true,
    hover: true,
    reactive: true,
    style_class: 'my-menu-item',
});

// Adding an ornament
menuItem.setOrnament(PopupMenu.Ornament.CHECK);

// Disabling the item (active property will no longer change)
menuItem.sensitive = false;

// Watching the `activate` signal
menuItem.connect('activate', (item, event) => {
    // Do something special for pointer buttons
    if (event.get_type() === Clutter.EventType.BUTTON_PRESS)
        console.log('Pointer was pressed!');
        
    return Clutter.EVENT_PROPAGATE;
});
```

### `PopupMenuItem`

A simple menu item with a text label.

#### Methods

* `new PopupMenuItem(text, params)` — Constructor
    * text (`String`) — The item label
    * params (`Object`) — Additional item properties

#### Properties

* (`St.Label`) `label` — A [`St.Label`][stlabel] (read-only)

[stlabel]: https://gjs-docs.gnome.org/st10/st.label

#### Example

```js
const PopupMenu = imports.ui.popupMenu;

const menuItem = new PopupMenu.PopupMenuItem('Item Label',
    {});
    
// Setting the label
menuItem.label.text = 'New Label';
```

### `PopupImageMenuItem`

This menu item is like `PopupMenuItem`, with a small icon placed before the
label.

#### Methods

* `new PopupImageMenuItem(text, icon, params)` — Constructor
    * text (`String`) — The item label
    * icon (`String`|`Gio.Icon`) — A themed icon name or [`Gio.Icon`][gicon]
    * params (`Object`) — Additional item properties
* `setIcon(icon)` — Sets the icon for the item
    * icon (`String`|`Gio.Icon`) — A themed icon name or [`Gio.Icon`][gicon]

#### Properties

* `icon` (`St.Icon`) — An [`St.Icon`][sticon] (read-only)
* `label` (`St.Label`) — An [`St.Label`][stlabel] (read-only)

[sticon]: https://gjs-docs.gnome.org/st10/st.icon
[stlabel]: https://gjs-docs.gnome.org/st10/st.label

#### Example

```js
const PopupMenu = imports.ui.popupMenu;

const menuItem = new PopupMenu.PopupImageMenuItem('Item Label',
    'info-symbolic', {});

// Setting the icon, by method or property
menuItem.setIcon('info-symbolic');
menuItem.icon.icon_name = 'info-symbolic';

// Setting the label
menuItem.label.text = 'New Label';
```

[gicon]: https://gjs-docs.gnome.org/gio20/gio.icon

### `PopupSeparatorMenuItem`

This menu item is used to separate other items, with an optional label.

#### Methods

* `new PopupSeparatorMenuItem(text)` — Constructor
    * text (`String`) — Optional item label

#### Properties

* `label` (`St.Label`) — An [`St.Label`][stlabel] (read-only)

[stlabel]: https://gjs-docs.gnome.org/st10/st.label

#### Example

```js
const PopupMenu = imports.ui.popupMenu;

const menuItem = new PopupMenu.PopupSeparatorMenuItem('Optional Label');

// Setting the label
menuItem.label.text = 'New Label';
```

### `PopupSwitchMenuItem`

This menu item is like `PopupMenuItem`, with a switch placed after the label.

#### Methods

* `new PopupImageMenuItem(text, active, params)` — Constructor
    * text (`String`) — The item label
    * active (`Boolean`) — The initial state of the switch
    * params (`Object`) — Additional item properties
* `setStatusText(text)` — Sets the label for the switch widget
    * text (`String`|`null`) — The switch label or `null` to disable
* `setToggleState(state)` — Sets the state of the switch
    * state (`Boolean`) — The new switch state
* `toggle()` — Toggle the switch state

#### Properties

* `label` (`St.Label`) — An [`St.Label`][stlabel] (read-only)
* `state` (`Boolean`) — The switch state (read-only)

[stlabel]: https://gjs-docs.gnome.org/st10/st.label

#### Signals

* `toggled(item, state)` — Emitted when the switch state changes
    * item (`PopupMenu.PopupSwitchMenuItem`) — The emitting object
    * state (`Boolean`) — The new switch state

[clutterevent]: https://gjs-docs.gnome.org/clutter10/clutter.event

#### Example

```js
const PopupMenu = imports.ui.popupMenu;

const menuItem = new PopupMenu.PopupSwitchMenuItem('Item Label',
    true, {});

// Getting and setting the switch state (both calls are equivalent)
menuItem.setToggleState(!menuItem.state);
menuItem.toggle();

// Setting the label
menuItem.label.text = 'New Label';

// Watching the switch state and updating the switch label
menuItem.connect('toggled', (item, state) => {
    item.setStatusText(state ? 'On' : 'Off');
});
```

### `PopupSubMenuMenuItem`

This menu item represent a submenu containing other items. It has an label, icon
and expander to reveal the items it contains.

#### Methods

* `new PopupSubMenuMenuItem(text, wantsIcon)` — Constructor
    * text (`String`) — The item label
    * wantIcon (`Boolean`) — Whether space should be allocated for an icon
* `setSubmenuShown(open)` — Opens or closes the submenu
    * open (`Boolean`) — `true` to open, or `false` to close

#### Properties

* `icon` (`St.Icon`) — An [`St.Icon`][sticon] if `wantIcon` was `true` at
    construct time (read-only)
* `label` (`St.Label`) — An [`St.Label`][stlabel] (read-only)
* `menu` (`PopupMenu.PopupSubMenu`) — The submenu (read-only)

[sticon]: https://gjs-docs.gnome.org/st10/st.icon
[stlabel]: https://gjs-docs.gnome.org/st10/st.label

#### Example

```js
const PopupMenu = imports.ui.popupMenu;

const menuItem = new PopupMenu.PopupSubMenuMenuItem('Item Label',
    true, {});

// Setting the icon
menuItem.icon.icon_name = 'info-symbolic';

// Setting the label
menuItem.label.text = 'New Label';

// Adding items
menuItem.menu.addAction('Submenu Item 1', () => console.log('activated'));
menuItem.menu.addAction('Submenu Item 2', () => console.log('activated'));
```


## Menus

### `PopupMenuBase`

There are several types of menus, all derived from the abstract base-class
`PopupBaseMenu`. This class cannot be created by itself, but contains a
number of methods, properties and signals common to all menus.

#### Methods

* `new PopupMenuBase(sourceActor, styleClass)` — Constructor
    * sourceActor (`Clutter.Actor`) — The [`Clutter.Actor`][clutteractor] the
        menu points to.
    * styleClass (`String`) — The CSS class of the menu
* `addAction(title, callback, icon)` — Adds an text item with a callback and
        optional icon.
    * title (`String`) — The item label
    * callback (`Function`) — A function to call when the item is activated.
        Passed the [`Clutter.Event`][clutterevent] as the only argument.
    * icon (`String`|`Gio.Icon`) — An optional themed icon name or
        [`Gio.Icon`][gicon]
    * Returns (`PopupMenu.PopupBaseMenuItem`) — The newly added item
* `addSettingsAction(title, desktopFile)` — Adds an item that opens a GNOME
        Settings page
    * title (`String`) — The item label
    * icon (`String`) — A freedesktop.org desktop file
    * Returns (`PopupMenu.PopupBaseMenuItem`) — The newly added item
* `addMenuItem(menuItem, position)` — Adds an item to the menu
    * menuItem (`PopupMenu.PopupBaseMenuItem`|`PopupMenu.PopupMenuSection`) —
        The item to add to the menu
    * position (`Number`) — Optional position to place the item at
* `moveMenuItem(menuItem, position)` — Moves an item to a position in the menu
    * menuItem (`PopupMenu.PopupBaseMenuItem`|`PopupMenu.PopupMenuSection`) —
        The item to reposition
    * position (`Number`) — The position to place the item at
* `isEmpty()` — Checks if the menu has any items
    * Returns (`Boolean`) — `true` if the menu is empty of items
* `open(animate)` — Opens the menu
    * animate (`BoxPointer.PopupAnimation`|`Boolean`) — The animation to use.
        `true` or `false` may be passed, as `BoxPointer.PopupAnimation.SLIDE`
        and `BoxPointer.PopupAnimation.NONE` respectively.
* `close(animate)` — Closes the menu
    * animate (`BoxPointer.PopupAnimation`|`Boolean`) — The animation to use.
        `true` or `false` may be passed, as `BoxPointer.PopupAnimation.SLIDE`
        and `BoxPointer.PopupAnimation.NONE` respectively.
* `removeAll()` — Remove and destroy all items in the menu
* `toggle()` — Toggles the open state of the menu
* `destroy()` — Destroys the menu and all its items

[clutterevent]: https://gjs-docs.gnome.org/clutter10/clutter.event
[gicon]: https://gjs-docs.gnome.org/gio20/gio.icon

#### Properties

* (`PopupMenu.PopupBaseMenuItem`|`PopupMenu.PopupMenuSection`) `firstMenuItem` —
    Gets the first item in the menu (read-only)
* `numMenuItems` (`Number`) — Gets the number of items in the menu (read-only)
* `sensitive` (`Boolean`) — Whether the menu is sensitive (read-write)

#### Signals

* `activate(menu, menuItem)` — Emitted when an item is activated
    * menu (`PopupMenu.PopupBaseMenu`) — The emitting object
    * menuItem (`PopupMenu.PopupBaseMenuItem`|`null`) — The active item, or
        `null` if no item is active
* `active-changed(menu, menuItem)` — Emitted when the active menu item changes
    * menu (`PopupMenu.PopupBaseMenu`) — The emitting object
    * menuItem (`PopupMenu.PopupBaseMenuItem`|`null`) — The active item, or
        `null` if no item is active
* `notify::sensitive(menu)` — Emitted when the menu sensitivity changes (note
        this is not a GObject emission)
    * menu (`PopupMenu.PopupBaseMenu`) — The emitting object
* `open-state-changed(menu, open)` — Emitted when the menu is opened or closed
    * menu (`PopupMenu.PopupBaseMenu`) — The emitting object
    * open (`Boolean`) — `true` if opened, `false` if closed
* `destroy(menu)` — Emitted when the menu is destroyed
    * menu (`PopupMenu.PopupBaseMenu`) — The emitting object

#### Example

```js
const St = imports.gi.St;

const BoxPointer = imports.ui.BoxPointer;
const PopupMenu = imports.ui.popupMenu;

const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Adding items
const menuItem1 = menu.addAction('Item 1', () => console.log('activated'));

const menuItem2 = new PopupMenu.PopupMenuItem('Item 2');
menu.addMenuItem(menuItem2, 0);

// Moving items
menu.moveMenuItem(menuItem2, 1);

// Opening and closing menus
menu.open(BoxPointer.PopupAnimation.FADE);
menu.close(BoxPointer.PopupAnimation.NONE);

// Removing items
menuItem1.destroy();
menu.removeAll();
```

### `PopupMenu`

A basic popup menu.

#### Methods

* `new PopupMenu(sourceActor, arrowAlignment, arrowSide)` — Constructor
    * sourceActor (`Clutter.Actor`) — The [`Clutter.Actor`][clutteractor] the
        menu points to.
    * arrowAlignment (`Number`) — A number between `0..1` for the alignment of
        the box pointer arrow
    * arrowSide (`St.Side`) — The [`St.Side`][stside] the box pointer arrow is
        on
* `setArrowOrigin(origin)` — Sets the origin for drawing the box pointer
    * origin (`Number`) — A coordinate on the x-axis or y-axis, depending on
        the construct-time `arrowSide` parameter
* `setSourceAlignment(alignment)` — Sets the arrow alignment for the box pointer
    * alignment (`Number`) — A number between `0..1`

[clutteractor]: https://gjs-docs.gnome.org/clutter10/clutter.actor
[stside]: https://gjs-docs.gnome.org/st10/st.side

#### Example

```js
const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;

const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Adding items
menu.addAction('Menu Item', () => console.log('activated'));
```

### `PopupMenuSection`

This is a menu that can be added to other menus as though it were an item. It's
usually used to organize items into groups, then added to a parent menu.

#### Example

```js
const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;

// Parent Menu
const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Menu Section
const section = new PopupMenu.PopupMenu();
section.addAction('Menu Item', () => console.log('activated'));

menu.addMenuItem(section);
```

### `PopupSubMenu`

This menu should typically only be used indirectly, by creating a
[`PopupSubMenuMenuItem`](#popupsubmenumenuitem).

#### Methods

* `new PopupSubMenu(sourceActor, sourceArrow)` — Constructor
    * sourceActor (`Clutter.Actor`) — The [`Clutter.Actor`][clutteractor] the
        menu points to.
    * sourceArrow (`Clutter.Actor`) — The parent item's expander arrow

[clutteractor]: https://gjs-docs.gnome.org/clutter10/clutter.actor


## Animations

Opening and closing menus can be animated, with several options to choose from.
These animations are in the [`BoxPointer`][js-boxpointer] module:

* `BoxPointer.PopupAnimation`
    * `BoxPointer.PopupAnimation.NONE` — No animation
    * `BoxPointer.PopupAnimation.SLIDE` — Slide in or out
    * `BoxPointer.PopupAnimation.FADE` — Fade in or out
    * `BoxPointer.PopupAnimation.FULL` — Slide and fade, in or out

[js-boxpointer]: https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/main/js/ui/boxpointer.js

