---
title: Dialogs In Your App & Closing Files
date: 2018-07-25 16:10:11
---
# Dialogs In Your App & Closing Files

## Closing the file

In order to handle closing a file we will first need to add a close file button.

// TODO: Add Glade Images

And handle clicks...

// TODO Source code

Now let's actually implement `/* file close code */`. We will essentially be reversing everything we did in `/* file open code */`.

`this._fileNotesTextView.set_sensitive(false);`
`this._fileNotesTextView.set_buffer(null);`  // TODO
`this._headerBar.setTitle('Tags');`

Now we should have:

// ETC

## Ask the user if there are unsaved changes

### Creating a dialog.
### Working on it....



