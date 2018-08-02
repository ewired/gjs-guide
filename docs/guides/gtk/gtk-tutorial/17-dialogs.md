---
title: Dialogs
---

# Dialogs

WIP

### Creating a dialog

To create the dialog we'll use `GtkMessageDialog`. GtkMessageDialog 

```js
let dialog = new Gtk.MessageDialog({
    title: 'Save?',
    text: 'Do you want to save your notes?',
    buttons: [Gtk.ButtonsType.NONE],
    parent: this,
    transient_for: this
})

dialog.add_button('Cancel', Gtk.ResponseType.CANCEL);
dialog.add_button('Close Without Saving', Gtk.ResponseType.NO);
dialog.add_button('Save Notes', Gtk.ResponseType.NO);
```

### Responding to the dialog

Now we'll need to respond to the dialog. To do this we'll use the return result of `dialog.run()`.

```js
let response = dialog.run();

if(response === Gtk.ResponseType.YES) {
  /* save code */
  /* exit code */
} else if (response === Gtk.ResponseType.NO) {
  /* exit code */
} else {
  /* do nothing */
}
```