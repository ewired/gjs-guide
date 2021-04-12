---
title: Basic File Operations
sidebar: "auto"
---

# Basic File Operations

## Getting a Gio.File Instance

```js
// We use GLib.build_filenamev to abstract away path separators like '/' and '\'
let path = GLib.build_filenamev([GLib.get_home_dir(), "testing.txt"]);
// Let's create a Gio.File instance from our path
let file = Gio.File.new_for_path(path);
```

## Creating a file

### Permissions

Permissions are written in octal notation. See [this guide](https://github.com/rockon999/unix-permissions-cheat-sheet/blob/master/README.md#octal-notation) for more information on Unix permissions;

| Earlier Versions                                | 1.50+                             |
| ----------------------------------------------- | --------------------------------- |
| `const PERMISSIONS_MODE = parseInt('0744', 8);` | `const PERMISSIONS_MODE = 0o744;` |

### Saving Content

```js
if (GLib.mkdir_with_parents(file.get_parent().get_path(), PERMISSIONS_MODE) === 0) {
  let [success, tag] = file.replace_contents(
    text,
    null,
    false,
    Gio.FileCreateFlags.REPLACE_DESTINATION,
    null
  );
}
```

## Loading A File's Contents

### Load Entire File

```js
const { Gio, GLib } = imports.gi;
let [success, contents] = file.load_contents(null);
log(contents);
```

<!--### Load Part of a File

*TODO*-->
