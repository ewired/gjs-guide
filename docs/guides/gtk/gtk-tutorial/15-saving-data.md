---
title: Saving Application Data
---

# Saving Application Data

We now have a full GTK+ application working! For many applications, though, storing user data is critical for functionality. A common example might be reopening the data or file that was in use before the application previously exited.

## Converting Data

Let's start with a simple data object. This will store the last used file by the user.

```js
let lastUsedFile = {
    fileName: "/file/path/is/here",
    fileDescription: "this is a description of the file"
};
```

We first need to convert it to [JSON]() for storage. GJS has built-in functions for this:

```js
let dataJSON = JSON.stringify(lastUsedFile);
```

## Locating Where To Save Data

Now we need to save `dataJSON`. Applications typically store data in their local configuration directory. You may know this as `~/.config/example-application/` but it varies on some systems so we should always use GLib's APIs to find it.

```js
let dataDir = GLib.get_user_config_dir();
```

Now that we have the directory, we can build the storage path.

```js
let destination = GLib.build_filenamev([dataDir, 'example-application', 'lastFile.json']);
```

This code builds the destination path string. We use `GLib.build_filenamev` to handle special cases where simple `/` strings don't work!

*Always look for official APIs to handle file names!*

## Saving Data To A File

Now let's finish up by actually writing to the file.

```js
let destinationFile = Gio.File.new_for_path(destination);

if (GLib.mkdir_with_parents(destinationFile.get_parent().get_path(), PERMISSIONS_MODE) === 0) {
    let [success, tag] = file.replace_contents(dataJSON, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);

    if(success) {
        /* it worked! */
    } else {
        /* it failed */
    }
} else {
     /* error */
}
```

This code comes from [GJS Basic File Operations](../../gjs/basic-file-operations.html).

***And it is saved!***


