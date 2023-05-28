---
title: Accessibility
---

# Accessibility

Accessibility is a topic that usually focuses on assistive technologies like
screen readers, keyboard navigation and high-contrast themes. However, working
accessibility is a hard requirement of a proper user interface, not a feature.

Clutter and St have built-in support for accessibility, which means two things:

1. It works by default

   You probably don't need to do anything to support accessibility, except
   basic testing before a release. Standard widgets like buttons and menus
   already use the correct attributes, and the focus order is usually as logical
   as the layout.

2. If it doesn't work, there is a bug in your code

   Broken accessibility either means you have a design flaw, or a widget with
   incorrect roles, relationships or states. Usually you just need to set some
   properties, or make a few function calls.

This document will teach you the basics of implementing accessibility, with
examples of the type of widgets that have built-in support.

### Further Reading

* [Accessibility](https://developer.gnome.org/hig/guidelines/accessibility.html)
    in the [GNOME HIG](https://developer.gnome.org/hig)
* [Accessibility](https://developer.gnome.org/documentation/guidelines/accessibility.html)
    in the [GNOME Developer Documentation](https://developer.gnome.org/documentation)

## Basic Concepts

The library used to set accessible attributes in GNOME Shell is [`Atk`][atk],
and [`St.Widget`][st-widget] includes convenience methods and properties,
with access to the [`Atk.Object`][atk-object] for everything else.

Roles, relationships and states define the semantics of an element in the user
interface. Roles like [`Atk.Role.RADIO_BUTTON`][atk-role-radiobutton] affect
presentation, behavior and keyboard focus, but they also have a range of
states dependent on their relationship with other elements. The semantics are
the shared language of design, code, translations and user experience.

[atk]: https://gjs-docs.gnome.org/atk10/
[atk-object]: https://gjs-docs.gnome.org/atk10/atk.object
[st-widget]: https://gjs-docs.gnome.org/st12/st.widget
[atk-role-radiobutton]: https://gjs-docs.gnome.org/atk10/atk.role#default-radio_button

### Roles

The [`Atk.Role`][atk-role] is usually static, and represents the primary purpose
of an element in the user interface. You can use the
[`St.Widget:accessible-role`][st-widget-accessiblerole] property to check and
set the proper role.

In addition to accessible relationships, the role may depend on another widget.
For example, a menu item should have the role `Atk.Role.CHECK_MENU_ITEM` if it
has a child with the role `Atk.Role.CHECK_BUTTON`.

[atk-role]: https://gjs-docs.gnome.org/atk10/atk.role
[st-widget-accessiblerole]: https://gjs-docs.gnome.org/st12/st.widget#property-accessible_role

### Relationships

The [`Atk.RelationType`][atk-relationtype] set an element has establishes
meaningful links to other elements, like a label and the widget it describes.
This is the most common relationship and handled automatically by the
[`St.Widget:label-actor`][st-widget-labelactor] property, which should usually
be set to a widget with the role [`Atk.Role.LABEL`][atk-role-label] like
[`St.Label`][st-label].

For other relationships, you can call the inherited method
[`Clutter.Actor.get_accessible()`][clutter-actor-getaccessible]
to get the [`Atk.Object`][atk-object], then call
[`Atk.Object.add_relationship()`][atk-object-addrelationship] and
[`Atk.Object.removed_relationship()`][atk-object-removerelationship] as needed.

[atk-object]: https://gjs-docs.gnome.org/atk10/atk.object
[atk-object-addrelationship]: https://gjs-docs.gnome.org/atk10/atk.object#method-add_relationship
[atk-object-removerelationship]: https://gjs-docs.gnome.org/atk10/atk.object#method-remove_relationship
[atk-role-label]: https://gjs-docs.gnome.org/atk10/atk.role#default-label
[atk-relationtype]: https://gjs-docs.gnome.org/atk10/atk.relationtype
[clutter-actor-getaccessible]: https://gjs-docs.gnome.org/clutter12/clutter.actor#method-get_accessible
[st-label]: https://gjs-docs.gnome.org/st12/st.label
[st-widget-labelactor]: https://gjs-docs.gnome.org/st12/st.widget#property-label_actor

### States

The [`Atk.StateType`][atk-statetype] determines the current state of an
element, many of which are already handled by `St`. States can be added with
[`St.Widget.add_accessible_state()`][st-widget-addaccessiblestate] and
[`St.Widget.remove_accessible_state()`][st-widget-removeaccessiblestate]
respectively.

Common states like `Atk.StateType.SENSITIVE` and `Atk.StateType.VISIBLE` are
handled by Clutter based on properties like `Clutter.Actor:reactive` and
`Clutter.Actor:visible`. `St.Widget:can-focus` sets `Atk.StateType.FOCUSABLE`,
while watching for the CSS pseudo-classes `checked` and `selected` to apply the
`Atk.StateType.CHECKED` and `Atk.StateType.SELECTED` states.

Other more purposeful widgets also set the state, such as `St.Button`. It uses
the [`St.Button:toggle-mode`][st-button-togglemode] property to change its role
and updates the state by adding or removing the CSS pseudo-class `checked`
when the [`St.Button:checked`][st-button-checked] property changes.

[atk-statetype]: https://gjs-docs.gnome.org/atk10/atk.statetype
[st-button-checked]: https://gjs-docs.gnome.org/st12/st.button#property-checked
[st-button-togglemode]: https://gjs-docs.gnome.org/st12/st.button#property-toggle_mode
[st-widget-addaccessiblestate]: https://gjs-docs.gnome.org/st12/st.widget#method-addaccessiblestate
[st-widget-removeaccessiblestate]: https://gjs-docs.gnome.org/st12/st.widget#method-removeaccessiblestate

## Implementing Accessibility

The [`PopupMenu.PopupSwitchMenuItem`][popupmenu-popupswitchmenuitem] class from
GNOME Shell has examples of almost everything you'll need to do. It subclasses
a generic widget to implement the role and state of a switch. It then subclasses
the base menu item and ensures the role, relationships and state are updated to
match the switch.

[popupmenu-popupswitchmenuitem]: ../topics/popup-menu.md#popupswitchmenuitem

### Basic Example

The accessible role of the switch is set to `Atk.Role.CHECK_BUTTON`, while the
`PopupMenu.Switch:state` property updates the accessible state by adding and
removing the `checked` pseudo-class (just like `St.Button`).

```js
var Switch = GObject.registerClass({
    Properties: {
        'state': GObject.ParamSpec.boolean(
            'state', 'state', 'state',
            GObject.ParamFlags.READWRITE,
            false),
    },
}, class Switch extends St.Bin {
    _init(state) {
        this._state = false;

        super._init({
            style_class: 'toggle-switch',
            accessible_role: Atk.Role.CHECK_BOX,
            state,
        });
    }

    get state() {
        return this._state;
    }

    set state(state) {
        if (this._state === state)
            return;

        if (state)
            this.add_style_pseudo_class('checked');
        else
            this.remove_style_pseudo_class('checked');

        this._state = state;
        this.notify('state');
    }

    toggle() {
        this.state = !this.state;
    }
});
```

The `PopupMenu.PopupSwitchMenuItem` is given the role `Atk.Role.CHECK_MENU_ITEM`
by default, while the state is kept in sync with the `PopupMenu.Switch`. Also
notice that `St.Widget:label-actor` is set on the menu item, so that the item's
label is understood to describe it.

The menu item also handles the case where the switch is disabled. If
`PopupMenu.PopupSwitchMenuItem.setStatus()` is called with a non-`null` value,
the item will change roles to `Atk.Role.MENU_ITEM`, the `Atk.StateType.CHECKED`
state is removed and the switch is replaced with a status label.

```js
var PopupSwitchMenuItem = GObject.registerClass({
    Signals: { 'toggled': { param_types: [GObject.TYPE_BOOLEAN] } },
}, class PopupSwitchMenuItem extends PopupBaseMenuItem {
    _init(text, active, params) {
        super._init(params);

        this.label = new St.Label({
            text,
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._switch = new Switch(active);

        this.accessible_role = Atk.Role.CHECK_MENU_ITEM;
        this.checkAccessibleState();
        this.label_actor = this.label;

        this.add_child(this.label);

        this._statusBin = new St.Bin({
            x_align: Clutter.ActorAlign.END,
            x_expand: true,
        });
        this.add_child(this._statusBin);

        this._statusLabel = new St.Label({
            text: '',
            style_class: 'popup-status-menu-item',
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._statusBin.child = this._switch;
    }

    setStatus(text) {
        if (text != null) {
            this._statusLabel.text = text;
            this._statusBin.child = this._statusLabel;
            this.reactive = false;
            this.accessible_role = Atk.Role.MENU_ITEM;
        } else {
            this._statusBin.child = this._switch;
            this.reactive = true;
            this.accessible_role = Atk.Role.CHECK_MENU_ITEM;
        }
        this.checkAccessibleState();
    }

    activate(event) {
        if (this._switch.mapped)
            this.toggle();

        // we allow pressing space to toggle the switch
        // without closing the menu
        if (event.type() == Clutter.EventType.KEY_PRESS &&
            event.get_key_symbol() == Clutter.KEY_space)
            return;

        super.activate(event);
    }

    toggle() {
        this._switch.toggle();
        this.emit('toggled', this._switch.state);
        this.checkAccessibleState();
    }

    get state() {
        return this._switch.state;
    }

    setToggleState(state) {
        this._switch.state = state;
        this.checkAccessibleState();
    }

    checkAccessibleState() {
        switch (this.accessible_role) {
        case Atk.Role.CHECK_MENU_ITEM:
            if (this._switch.state)
                this.add_accessible_state(Atk.StateType.CHECKED);
            else
                this.remove_accessible_state(Atk.StateType.CHECKED);
            break;
        default:
            this.remove_accessible_state(Atk.StateType.CHECKED);
        }
    }
});
```
