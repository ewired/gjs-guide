---
title: Dialogs In Your App & Closing Files
date: 2018-07-25 16:10:11
---
# Dialogs In Your App & Closing Files

## Exiting the file

### Adding the back button

When the user wants to "exit" a file we want to send them back to the screen they started at. The best way to represent this is a back button. So let's put on in our headerbar.

<img :src="$withBase('/assets/img/back-button-1.png')" />

Once you've added the button name it `backButton`. Make sure to select `Add custom content` and put a `GtkImage` inside the open slot.

<img :src="$withBase('/assets/img/back-button-3.png')" />

Now, set the `GtkImage` `Image` property to *`Icon Name`* and select `go-previous-symbolic`.

<img :src="$withBase('/assets/img/back-button-4.png')" />

Because we want the back button all the way to the left we have to adjust the position of the buttons. Go to `Packing` and change the back button's position to `0`.

<img :src="$withBase('/assets/img/back-button-5.png')" />

Now change the open file button's position to one in `Packing`.

### And handle clicks...

In `_init()` write...

```js
this._backButton.connect('clicked', () => {
    log('addFileButton has been clicked.');
    /* file close code*/
});

```

Now let's actually implement `/* file close code */`. We will essentially be reversing everything we did in `/* file open code */`.

```js
this._fileNotesTextView.set_sensitive(false);
this._fileNotesTextView.set_buffer(null); // TODO 
this._headerBar.setTitle('Tags');
```

Now we should have:

```js
this._backButton.connect('clicked', () => {
    log('addFileButton has been clicked.');
    this._fileNotesTextView.set_sensitive(false);
    this._fileNotesTextView.set_buffer(null); // TODO 
    this._headerBar.setTitle('Tags');
});
```

## Asking the user if there are unsaved changes before exiting

We want to always ask the user whether they want to save their notes before exiting. To do this we'll need a dialog.

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

Your final code should look something [like this]().

