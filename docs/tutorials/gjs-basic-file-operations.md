---
title: Basic File Operations
date: 2018-07-25 16:10:11
---
# Basic File Operations in GJS with Gio
## Getting a Gio.File Instance
<code>
// We use GLib.build_filenamev to abstract away path separators like '/' and '\'
<br/>let path = GLib.build_filenamev([GLib.get_home_dir(),  'testing.txt']);
// Let's create a Gio.File instance from our path
<br/>let file = Gio.File.new_for_path(path);
</code>

## Creating a file

### Permissions

Permissions are written in octal notation. See [this guide](https://github.com/rockon999/unix-permissions-cheat-sheet/blob/master/README.md#octal-notation) for more information on Unix permissions; 

| Earlier Versions | 1.50+ |
|-|-|
|`const PERMISSIONS_MODE = parseInt('0744', 8);`|`const PERMISSIONS_MODE = 0o744;`|

### Saving Content

<code>if (GLib.mkdir_with_parents(file.get_parent().get_path(), PERMISSIONS_MODE) === 0) {
     &nbsp;&nbsp;&nbsp;&nbsp;let [success, tag] = file.replace_contents(text, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
 }</code>


## Loading A File's Contents

### Load Entire File

<code>const { Gio, GLib } = imports.gi;
let [success, contents] = file.load_contents(null);
log(contents);</code>

### Load Part of a File
*TODO*



