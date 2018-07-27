---
title: Saving Files In Your App
date: 2018-07-25 16:10:11
---
# Saving Files In Your App

We want to be able to quickly jot a few notes down about any file we open. To do this we need to do a few things...

- Add a text view to type in
- Add a method to save any notes to a file

And when the user clicks `addFileButton`...

- Open a file
- Change the window title to the current file name
- Enable the text view

## Adding the text view

// Glade parts

Now add `fileNotesTextView` to your `InternalChildren` array [from Part 00]().

As a file hasn't been opened yet, we will disable the text view so the user doesn't think they can write in it.

Add `this._fileNotesTextView.set_sensitive(false);` in `_init` in `window.js`.  `window.js` should now look [like this]().

## Handling `addFileButton` click

In our `_init` function in `window.js` we'll add the click event handler.

<code>this._addFileButton.connect('clicked', () => {
&nbsp;&nbsp;&nbsp;&nbsp;log('addFileButton has been clicked.');
});</code>

`window.js` should now look like [this]().

 When the user clicks on our `addFileButton` we wanted to do a few things...
 - Open a file
 - Change the window title to the current file name
- Enable the text view

### Opening a file

To open a file we need to have the user select which file first. GTK+ provides a few methods of doing this but the simplest and most cross-platform is `GtkFileChooserNative`.

First create a new `GtkFileChooserNative`:

<code>const fileChooserDialog = new Gtk.FileChooserNative({
&nbsp;&nbsp;&nbsp;&nbsp;title: 'Select a File',
&nbsp;&nbsp;&nbsp;&nbsp;parent: this,
&nbsp;&nbsp;&nbsp;&nbsp;action: Gtk.FileChooserAction.OPEN,
&nbsp;&nbsp;&nbsp;&nbsp;accept_label: 'Add Notes'
});</code>

Now we'll run the file chooser.

`let result = fileChooserDialog.run();`

Let's handle the result...

<code>if (result === Gtk.Response.ACCEPT) {
&nbsp;&nbsp;&nbsp;&nbsp;/* file open code */
}</code>

We we'll implement `/* file open code */` in the next section.

*For more information on handling files in GJS go to [GJS Basic File Operations]()*

### Changing the window title

First we'd like to change the window title to reflect the new file. Add this code to our event handler for `addFileButton`: 

`let file = fileChooserDialog.get_file();`
`let fileInfo = file.query_info(Gio.FILE_ATTRIBUTE_STANDARD_NAME, 0, null);`

<code>
if (fileInfo !== null) {
<br />&nbsp;&nbsp;&nbsp;&nbsp;let title = fileInfo.get_attribute_as_string(Gio.FILE_ATTRIBUTE_STANDARD_NAME);
<br />&nbsp;&nbsp;&nbsp;&nbsp;this._headerBar.set_title(title)
<br />} else {
<br />&nbsp;&nbsp;&nbsp;&nbsp;// Fallback on the literal file name
<br />&nbsp;&nbsp;&nbsp;&nbsp;this._headerBar.set_title(file.get_basename());
<br />}
</code>

The event handler should now look [like this]().

### Enabling the text view

For the user to be able to type in the text view we must enable it.

Firstly...

`this._fileNotesTextView.set_sensitive(true);`

Now we must add a buffer for the typed words to live in...

`this._fileNotesTextView.set_buffer(new Gtk.TextBuffer())`

And there you have it!

## Saving the notes

### Adding a save button

// Glade

### Handling `saveButton` clicks

Similar to above we add an event handler...

In our `_init` function in `window.js` we'll add the `saveButton` click event handler.

<code>this._saveButton.connect('clicked', () => {
&nbsp;&nbsp;&nbsp;&nbsp;log('saveButton has been clicked.');
});</code>

`window.js` should now look like [this]().

We'll actually save the data in the next section.

### Saving the notes to a file

We'll implement a very simple system for saving the notes. We'll create a file with the name `{{fileName}}.notes` in the directory
`{{configDirectory}}/{{filePath}}/`.

First let's get the notes...

`let notes = this._fileNotesTextView.get_buffer().get_text();`

Now let's construct a data object to save...

`let data = { notes };`

And convert it to JSON for storage...

`let dataJSON = JSON.stringify(data);`

Now let's save it!

`let dataDir = GLib.get_user_config_dir();`

Let's get the user's configuration directory. You may know this as `~/.config` but it varies on some systems so we should always use GLib's APIs to find it.

`let fileDir = file.get_path();`
<code>let destinationFileName = \`${file.get_basename()}.notes\`;</code>
`let destination = GLib.build_filenamev([dataDir, fileDir, destinationFileName]);`

This builds the destination path string. We use `GLib.build_filenamev` to handle special cases where simple `/` makes don't work!

*Always look for official APIs to handle file names!*

Now let's finish up by actually writing to the file.

`let destinationFile = Gio.File.new_for_path(destination);`

<code>if (GLib.mkdir_with_parents(destinationFile.get_parent().get_path(), PERMISSIONS_MODE) === 0) {
     &nbsp;&nbsp;&nbsp;&nbsp;let [success, tag] = file.replace_contents(dataJSON, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
 } else { <br />&nbsp;&nbsp;&nbsp;&nbsp;/* error */<br /> }</code>

This code comes from [GJS Basic File Operations]().

***And it is saved!***


