---
title: Dialogs
---

# Dialogs

::: tip
Some elements in this module are pure JavaScript and do not support GObject
features like property bindings.
:::

The [`Dialog`][js-dialog] and [`ModalDialog`][js-modaldialog] modules contain
classes for creating dialogs in GNOME Shell. Extension authors might use these
when they would normally use a GTK dialog, which can't be created in the
GNOME Shell process.

[js-dialog]: https://gitlab.gnome.org/GNOME/gnome-shell/tree/main/js/ui/dialog.js
[js-modaldialog]: https://gitlab.gnome.org/GNOME/gnome-shell/tree/main/js/ui/modalDialog.js

## `Shell`

::: warning
The `Shell` import is a C library, available only to GNOME Shell and extensions.
These elements are documented here due to an unfixed bug in the official
[`Shell` API Documentation](https://gjs-docs.gnome.org/st12), which should be
preferred for all other cases.
:::

### `Shell.ActionMode`

Controls in which GNOME Shell states an action (like keybindings and gestures)
should be handled.

* `Shell.ActionMode`
    * `Shell.ActionMode.NONE` — block action
    * `Shell.ActionMode.NORMAL` — allow action when in window mode, e.g. when
        the focus is in an application window
    * `Shell.ActionMode.OVERVIEW` — allow action while the overview is active
    * `Shell.ActionMode.LOCK_SCREEN` — allow action when the screen is locked,
        e.g. when the screen shield is shown
    * `Shell.ActionMode.UNLOCK_SCREEN` — allow action in the unlock dialog
    * `Shell.ActionMode.LOGIN_SCREEN` — allow action in the login screen
    * `Shell.ActionMode.SYSTEM_MODAL` — allow action when a system modal dialog
        (e.g. authentication or session dialogs) is open
    * `Shell.ActionMode.LOOKING_GLASS` — allow action in looking glass
    * `Shell.ActionMode.POPUP` — allow action while a shell menu is open
    * `Shell.ActionMode.ALL` — always allow action

## `Dialog`

The `Dialog` module contains base classes for creating and working with
dialogs in GNOME Shell.

### `Dialog.Dialog`

Parent Class: [`St.Widget`][stwidget]

The base class for dialog layouts. This is a fairly simple widget, with a
content area and an action area for buttons, used as the layout widget for
most dialogs.

The dialog handles key events, invoking the callback for buttons added with
`Dialog.addButton()` if they include a matching `key`.

[stwidget]: https://gjs-docs.gnome.org/st12/st.widget

#### Methods

* `new Dialog.Dialog(parentActor, styleClass)` — Constructor
    * parentActor (`Clutter.Actor`) — The parent actor to add the layout to
    * styleClass (`String`) — Optional CSS class for the dialog
* `addButton(buttonInfo)` — Add a button to the dialog
    * buttonInfo (`Object`) — Button properties
        * label (`String`) — The button label
        * action (`Function`) — Optional button activation callback
        * key (`Number`) — Optional [key constant][clutter-constants], such as
            `Clutter.KEY_A` or `Clutter.KEY_space`
        * isDefault (`Boolean`) — If `true`, the button will be activated by the
            enter key and receive the default focus
* `clearButtons()` — Removes all buttons from the dialog

[clutter-constants]: https://gjs-docs.gnome.org/clutter12-constants/

#### Properties

* `contentLayout` (`St.BoxLayout`) — The content area of the dialog
    (JavaScript: read-only)
* `buttonLayout` (`St.BoxLayout`) — The action area, where buttons are added
    (JavaScript: read-only)

#### Example

@[code js](@src/extensions/topics/dialogs/dialogDialog.js)

### `Dialog.MessageDialogContent`

Parent Class: [`St.BoxLayout`][stboxlayout]

A widget for the common case of creating a dialog with a title and description,
like `Gtk.MessageDialog`.

[stboxlayout]: https://gjs-docs.gnome.org/st12/st.boxlayout

#### Methods

* `new Dialog.MessageDialogContent(params)` — Constructor
    * params (`Object`) — A dictionary of GObject construct properties

#### Properties

* `title` (`String`) — The message title
    (GObject: read-write)
* `description` (`String`) — The message description
    (GObject: read-write)

#### Example

@[code js](@src/extensions/topics/dialogs/dialogMessageDialogContent.js)

### `Dialog.ListSection`

Parent Class: [`St.BoxLayout`][stboxlayout]

A widget for the common case of creating a dialog with a list box of items,
such as a dialog for connecting to a wireless network. This is intended to be
used with [`Dialog.ListSectionItem`](#dialog-listsectionitem).

[stboxlayout]: https://gjs-docs.gnome.org/st12/st.boxlayout

#### Methods

* `new Dialog.ListSection(params)` — Constructor
    * params (`Object`) — A dictionary of GObject construct properties

#### Properties

* `title` (`String`) — The list title
    (GObject: read-write)
* `list` (`St.BoxLayout`) — The list box
    (JavaScript: read-only)

#### Example

@[code js](@src/extensions/topics/dialogs/dialogListSection.js)

### `Dialog.ListSectionItem`

Parent Class: [`St.BoxLayout`][stboxlayout]

A widget for the common case of creating a dialog with a title and description,
like `Gtk.MessageDialog`.

[stboxlayout]: https://gjs-docs.gnome.org/st12/st.boxlayout

#### Methods

* `new Dialog.MessageDialogContent(params)` — Constructor
    * params (`Object`) — A dictionary of GObject construct properties

#### Properties

* `icon-actor` (`Clutter.Actor`) — An icon for the item
    (GObject: read-write)
* `title` (`String`) — The item title
    (GObject: read-write)
* `description` (`String`) — The item description
    (GObject: read-write)

#### Example

See the example for [`Dialog.ListSection`](#dialog-listsection)

## `ModalDialog`

The `ModalDialog` module includes the primary class for creating dialogs,
[`ModalDialog.ModalDialog`](#modaldialog-modaldialog).

This is a fairly lightweight class, so it is often wrapped by an object that
creates instances of `ModalDialog.ModalDialog` on-demand that are destroyed
when closed.

### `ModalDialog.State`

Enumeration of dialog states.

* `ModalDialog.State`
    * `ModalDialog.State.OPENED` — The dialog is opened
    * `ModalDialog.State.CLOSED` — The dialog is closed
    * `ModalDialog.State.OPENING` — The dialog is opening
    * `ModalDialog.State.CLOSING` — The dialog is closing
    * `ModalDialog.State.FADED_OUT` — The dialog is faded out

### `ModalDialog.ModalDialog`

Parent Class: [`St.Widget`][stwidget]

A modal dialog. This class sets up a [`Dialog.Dialog`](#dialog-dialog) layout
automatically.

#### Methods

* `new ModalDialog.ModalDialog(params)` — Constructor
    * params (`Object`) — A dictionary of specific construct properties
        * shellReactive (`Boolean`) — Whether the shell is sensitive when the
            dialog is open (default: `false`)
        * actionMode (`Shell.ActionMode`) — A [`Shell.ActionMode`](#shell-actionmode)
            (default: `Shell.ActionMode.SYSTEM_MODAL`)
        * shouldFadeIn (`Boolean`) — Whether the dialog should fade in when
            opened (default: `true`)
        * shouldFadeOut (`Boolean`) — Whether the dialog should fade out when
            closed (default: `true`)
        * destroyOnClose (`Boolean`) — Whether the dialog should be destroyed
            when closed (default: `true`)
        * styleClass (`String`) — CSS class for the dialog (default: `null`)
* `addButton(buttonInfo)` — Add a button to the internal `Dialog.Dialog`
    * buttonInfo (`Object`) — Button properties
        * label (`String`) — The button label
        * action (`Function`) — Optional button activation callback
        * key (`Number`) — Optional [key constant][clutter-constants], such as
            `Clutter.KEY_A` or `Clutter.KEY_space`
        * isDefault (`Boolean`) — If `true`, the button will be activated by the
            enter key and receive the default focus
    * Returns (`St.Button`) — The newly added button
* `setButtons(buttonInfos)` — Set the buttons for the internal `Dialog.Dialog`,
    removing any existing buttons
    * buttonInfos (`Array(Object)`) — A list of button info objects
* `clearButtons()` — Removes all buttons from the internal `Dialog.Dialog`
* `setInitialKeyFocus(actor)` — Set an actor to receive the initial key focus
    * actor (`Clutter.Actor`) — The actor to focus
* `open(timestamp, onPrimary)` — Present the dialog
    * timestamp (`Number`) — Optional timestamp (i.e. `global.get_current_time()`)
    * onPrimary (`Boolean`) — Whether to show the dialog on the primary display
    * Returns (`Boolean`) — `true` if successful, `false` otherwise
* `close(timestamp)` — Hide the dialog
    * timestamp (`Number`) — Optional timestamp (i.e. `global.get_current_time()`)

#### Properties

* (`Number`) `state` — A [`ModalDialog.State`](#modaldialog-state)
    (GObject: read-only)
* (`Dialog.Dialog`) `dialogLayout` — A [`Dialog.Dialog`](#dialog-dialog) layout
    (JavaScript: read-only)
* (`St.BoxLayout`) `contentLayout` — The internal `Dialog.Dialog.contentLayout`
    (JavaScript: read-only)
* (`St.BoxLayout`) `buttonLayout` — The internal `Dialog.Dialog.buttonLayout`
    (JavaScript: read-only)

[stlabel]: https://gjs-docs.gnome.org/st10/st.label

#### Signals

* `closed` — Emitted when the dialog closes
    (GObject: no parameters or return values)
* `opened` — Emitted when the dialog opens
    (GObject: no parameters or return values)

[stlabel]: https://gjs-docs.gnome.org/st10/st.label

#### Example

@[code js](@src/extensions/topics/dialogs/modalDialogModalDialog.js)
