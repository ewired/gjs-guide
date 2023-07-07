---
title: File Operations
sidebar: "auto"
---

# File Operations

The best way to operate on files in GJS is with [`Gio.File`][gfile], which is an
abstraction of a file that can be treated like an object.

In contrast to the low-level functions available in GLib, `Gio.File` supports
asynchronous operations and many utility functions for creating, reading,
writing and querying information.

#### Promise Wrappers

This document uses asynchronous methods wrapped with
[`Gio._promisify()`](../gjs/asynchronous-programming.md#promisify-helper).

::: details Copy & Paste
@[code js](@src/guides/gio/file-operations/promisify.js)
:::

[gfile]: https://gjs-docs.gnome.org/gio20/gio.file


## Getting a File Object

Before you can create, read or write a file you need to create a `Gio.File`
object to operate on. Below is a simple example of create a `Gio.File` instance
for a file path:

@[code js](@src/guides/gio/file-operations/gfileNewPath.js)

You can also create a `Gio.File` instance from a URI, such as `file://` URIs.
Note that this function will never fail to return a `Gio.File` object for
a well-formed URI, but operations on the file will only succeed if the URI type
is supported.

@[code js](@src/guides/gio/file-operations/gfileNewUri.js)

[gfilenewforpath]: https://gjs-docs.gnome.org/gio20/gio.file#method-new_for_path
[gfilenewforuri]: https://gjs-docs.gnome.org/gio20/gio.file#method-new_for_uri


## Creating Files and Folders

A `Gio.File` object is only a representation of a file. To create a regular file
on disk, you can use [`Gio.File.create()`][gfilecreate]:

@[code js](@src/guides/gio/file-operations/gfileCreate.js)

If the file already exists, then `Gio.File.create()` will throw an error. If you
want to replace an existing file, use [`Gio.File.replace()`][gfilereplace]
instead and pass `Gio.FileCreateFlags.REPLACE_DESTINATION` in the flags
argument.

Both `Gio.File.create()` and `Gio.File.replace()` open the file in write mode
and return a [`Gio.FileOutputStream`][gfileoutputstream] so that you can follow
these calls by writing to the stream:

```js
const {GLib, Gio} = imports.gi;


const bytes = new GLib.Bytes('some file content');
const bytesWritten = await outputStream.write_bytes_async(bytes,
    GLib.PRIORITY_DEFAULT, null);
```

To create a directory instead, you can use
[`Gio.File.make_directory()`][gfilemakedirectory]:

@[code js](@src/guides/gio/file-operations/gfileMakeDirectory.js)

Note that this function will not make directories recursively, so you must use
[`Gio.File.make_directory_with_parents()`][gfilemakedirectorywithparents] if you
do want to do this manually. Unfortunately, there is no asynchronous version of
this method in GIO.

@[code js](@src/guides/gio/file-operations/gfileMakeDirectoryWithParents.js)

[gfilecreate]: https://gjs-docs.gnome.org/gio20/gio.file#method-create
[gfileoutputstream]: https://gjs-docs.gnome.org/gio20/gio.fileoutputstream
[gfilemakedirectory]: https://gjs-docs.gnome.org/gio20/gio.file#method-make_directory
[gfilemakedirectorywithparents]: https://gjs-docs.gnome.org/gio20/gio.file#method-make_directory_with_parents


## Simple Reading and Writing

For simple operations like loading the contents of a file or writing contents
out to file, you probably don't want to bother with I/O streams.


### Reading File Contents

To read the contents of a file, you can use
[`Gio.File.load_contents()`][gfileloadcontents]. The result of this operation
will be a [`Uint8Array`][uint8array]. To convert this to a string, you can use
[`TextDecoder()`][textdecoder] or `ByteArray.toString()`:

@[code js](@src/guides/gio/file-operations/gfileLoadContents.js)

[gfileloadcontents]: https://gjs-docs.gnome.org/gio20/gio.file#method-load_contents
[textdecoder]: https://developer.mozilla.org/docs/Web/API/TextDecoder
[uint8array]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/uint8array


### Writing File Contents

To write contents to a file, you can use
[`Gio.File.replace_contents()`][gfilereplacecontents].

Note that when writing contents asynchronously, it is strongly advised that you
use [`Gio.File.replace_contents_bytes_async()`][gfilereplacecontentsbytesasync].
Not doing so may lead to file corruption if you are not very careful with the
lifetime of the data.

@[code js](@src/guides/gio/file-operations/gfileReplaceContents.js)

[gfilereplacecontents]: https://gjs-docs.gnome.org/gio20/gio.file#method-replace_contents
[gfilereplacecontentsbytesasync]: https://gjs-docs.gnome.org/gio20~2.66p/gio.file#method-replace_contents_bytes_async


## Opening File Streams

When you want to perform more complicated operations on files or pipe the data
to or from another source, you can open IO streams for a file instead.

For example, to open file in read-only mode you can use
[`Gio.File.read()`][gfileread]. This will return a
[`Gio.FileInputStream`][gfileinputstream] so that you can follow this call by
reading from the stream:

@[code js](@src/guides/gio/file-operations/gfileRead.js)

To open file in read-write mode instead, you can use
[`Gio.File.open_readwrite()`][gfileopenreadwrite]. This will return a
[`Gio.FileIOStream`][gfileiostream], which holds both an `Gio.FileInputStream`
you can use for reading and a `Gio.FileOutputStream` you can use for writing:

@[code js](@src/guides/gio/file-operations/gfileOpenReadWrite.js)

There are several other comparable methods you can use, depending on what
operations you want to perform. See the documentation for the following methods
for details:

* [`Gio.File.append_to()`][gfileappendto]
* [`Gio.File.replace()`][gfilereplace]
* [`Gio.File.replace_readwrite()`][gfilereplacereadwrite]


[gfileread]: https://gjs-docs.gnome.org/gio20/gio.file#method-read
[gfileopenreadwrite]: https://gjs-docs.gnome.org/gio20/gio.file#method-open_readwrite
[gfileinputstream]: https://gjs-docs.gnome.org/gio20/gio.fileinputstream
[gfileiostream]: https://gjs-docs.gnome.org/gio20/gio.fileiostream
[gfileappendto]: https://gjs-docs.gnome.org/gio20/gio.file#method-append_to
[gfilereplace]: https://gjs-docs.gnome.org/gio20/gio.file#method-replace
[gfilereplacereadwrite]: https://gjs-docs.gnome.org/gio20/gio.file#method-replace_readwrite


## Copying and Moving Files

To copy files from one location to another, you will need a `Gio.File` object
for both the source and target locations. Once you have those, you can use
[`Gio.File.copy()`][gfilecopy] to copy the file.

Be sure to review the [`Gio.FileCopyFlags`][gfilecopyflags] documentation, to
select the correct flags for the operation you want to perform.

Note that `Gio.File.copy()` will not copy non-empty directories, nor will it
recursively copy files. To do that you must recursively copy files manually.

@[code js](@src/guides/gio/file-operations/gfileOpenReadWrite.js)

If you want to move a file instead of copying it, you can use
[`Gio.File.move()`][gfilemove]. Unlike `Gio.File.copy()`, this function can move
entire directories of files.

@[code js](@src/guides/gio/file-operations/gfileMove.js)

[gfilecopy]: https://gjs-docs.gnome.org/gio20/gio.file#method-copy
[gfilecopyflags]: https://gjs-docs.gnome.org/gio20/gio.filecopyflags
[gfilemove]: https://gjs-docs.gnome.org/gio20/gio.file#method-move


## Deleting Files

To delete files, you can use [`Gio.File.delete()`][gfiledelete]:

@[code js](@src/guides/gio/file-operations/gfileDelete.js)

Note that `Gio.File.delete()` will not delete non-empty directories, nor will it
recursively delete files. To do that you must recursively delete files
manually.

You may, however, use [`Gio.File.trash()`][gfiletrash] to send entire
directories of files to the user's Trash:

@[code js](@src/guides/gio/file-operations/gfileDelete.js)

[gfiledelete]: https://gjs-docs.gnome.org/gio20/gio.file#method-delete
[gfiletrash]: https://gjs-docs.gnome.org/gio20/gio.file#method-trash


## Getting File Information

To query file information, you can use [`Gio.File.query_info()`][gfilequeryinfo]
which will return a [`Gio.FileInfo`][gfileinfo]. Depending on the attributes you
request, the returned `Gio.FileInfo` object can be used to retrieve different
information about the file.

In the example below, all the standard attributes are pulled in by passing the
string `standard::*`. This could also be a list of specific namespaces and
attributes like `standard::name,standard::type,unix::uid`, but usually
everything you need will be included in `standard::*`.

You will also notice the flag `Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS`, which
indicates that if the `Gio.File` object represents a symbolic link that the info
for the link itself is being requested, not the file it points to.

For attributes in the `standard` namespace there are convenience methods like
[`Gio.FileInfo.get_size()`][gfileinfogetsize], but others require methods like
[`Gio.FileInfo.get_attribute_uint32()`][gfileinfogetattributeuint32].

@[code js](@src/guides/gio/file-operations/gfileQueryInfo.js)

[gfilequeryinfo]: https://gjs-docs.gnome.org/gio20/gio.file#method-query_info
[gfileinfo]: https://gjs-docs.gnome.org/gio20/gio.fileinfo
[gfileinfogetsize]: https://gjs-docs.gnome.org/gio20/gio.fileinfo#method-get_size
[gfileinfogetattributeuint32]: https://gjs-docs.gnome.org/gio20/gio.fileinfo#method-get_attribute_uint32


## Navigating Files and Directories

Navigating files and directories is quite simple, if you already know what
you're looking for. The [`Gio.File.get_child()`][gfilegetchild] and
[`Gio.File.get_parent()`][gfilegetparent] methods take a string and return a
`Gio.File` object for that path:

@[code js](@src/guides/gio/file-operations/gfileGetChildParent.js)

If you don't know the files you're looking for, you can instead list the files
and iterate them with [`Gio.File.enumerate_children()`][gfileenumeratechildren].
This method will return a [`Gio.FileEnumerator`][gfileenumerator] that you can
call [`Gio.FileEnumerator.next_file()`][gfileenumeratornextfile] on to retrieve
a `Gio.FileInfo` object for each file.

As of GJS 1.74 (GNOME 43), `Gio.FileEnumerator` supports the JavaScript
asynchronous and synchronous iterator protocols, making iterating directories
very straight-forward:

@[code js](@src/guides/gio/file-operations/gfileEnumeratorIterator.js)

The only benefit to enumerating files manually, is the ability to query
multiple files in a single call, which may have better performance:

@[code js](@src/guides/gio/file-operations/gfileEnumerator.js)

[gfilegetchild]: https://gjs-docs.gnome.org/gio20/gio.file#method-get_child
[gfilegetparent]: https://gjs-docs.gnome.org/gio20/gio.file#method-get_parent
[gfileenumeratechildren]: https://gjs-docs.gnome.org/gio20/gio.file#method-enumerate_children
[gfileenumerator]: https://gjs-docs.gnome.org/gio20/gio.fileenumerator
[gfileenumeratornextfile]: https://gjs-docs.gnome.org/gio20/gio.fileenumerator#method-next_file


## Monitoring Files and Directories

::: warning NOTE
You must hold a reference to a [`Gio.FileMonitor`][gfilemonitorobj] object, or
it will be collected and emit no signals.
:::

It is possible to monitor files and directories for changes with `Gio.File`. You
can use [`Gio.File.monitor()`][gfilemonitor] to monitor a file or directory for
changes.

Be sure to review the [`Gio.FileMonitorFlags`][gfilemonitorflags] documentation,
to select the correct flags for the operations you want to monitor.

@[code js](@src/guides/gio/file-operations/gfileMonitor.js)

[gfilemonitor]: https://gjs-docs.gnome.org/gio20/gio.file#method-monitor
[gfilemonitorobj]: https://gjs-docs.gnome.org/gio20/gio.filemonitor
[gfilemonitorflags]: https://gjs-docs.gnome.org/gio20/gio.filemonitorflags


## Complex Examples

A few more complex examples may be useful, to show how `Gio.File` can be used to
solve large or complicated problems without blocking the main thread.


### Recursively Operating on Files

Trash, deleting an entire directory of files is still a pretty common task.

It is also useful way to demonstrate how to walk a tree of files and call a
function on each file based on its type.

@[code js](@src/guides/gio/file-operations/gfileRecursive.js)

