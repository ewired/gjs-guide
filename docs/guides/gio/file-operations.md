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


[gfile]: https://gjs-docs.gnome.org/gio20/gio.file


## Getting a File Object

Before you can create, read or write a file you need to create a `Gio.File`
object to operate on. Below is a simple example of create a `Gio.File` instance
for a file path:

```js
const {Gio, GLib} = imports.gi;

// This is a useful method for building file paths from GLib. It will use the
// correct path separator for the current operating system (eg. `/` or `\`)
const filepath = GLib.build_filenamev([GLib.get_home_dir(), 'test-file.txt']);

const file = Gio.File.new_for_path(filepath);
```

You can also create a `Gio.File` instance from a URI, such as `file://` URIs.
Note that while this function will never fail to return a `Gio.File` object for
a well-formed URI, operations on the file will only succeed if the URI type is
supported.

```js
const {Gio} = imports.gi;

const file = Gio.File.new_for_uri('file:///home/username/test-file.txt');
```

[gfilenewforpath]: https://gjs-docs.gnome.org/gio20/gio.file#method-new_for_path
[gfilenewforuri]: https://gjs-docs.gnome.org/gio20/gio.file#method-new_for_uri


## Creating Files and Folders

A `Gio.File` object is only a representation of a file. To create a regular file
on disk, you can use [`Gio.File.create()`][gfilecreate]:

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
const outputStream = file.create(Gio.FileCreateFlags.NONE, null);

// Asynchronous, non-blocking method
const outputStream = await new Promise((resolve, reject) => {
    file.create_async(
        Gio.FileCreateFlags.NONE,
        GLib.PRIORITY_DEFAULT,
        null,
        (file_, result) => {
            try {
                resolve(file.create_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

If the file already exists, then `Gio.File.create()` will throw an error. If you
want to replace an existing file, use [`Gio.File.replace()`][gfilereplace]
instead and pass `Gio.FileCreateFlags.REPLACE_DESTINATION` in the flags
argument.

Both `Gio.File.create()` and `Gio.File.replace()` open the file in write mode
and return a [`Gio.FileOutputStream`][gfileoutputstream] so that you can follow
these calls by writing to the stream:

```js
const bytesWritten = await new Promise((resolve, reject) => {
    outputStream.write_bytes_async(
        new GLib.Bytes('some file content'),
        GLib.PRIORITY_DEFAULT,
        null,
        (stream_, result) => {
            try {
                resolve(outputStream.write_bytes_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

To create a directory instead, you can use
[`Gio.File.make_directory()`][gfilemakedirectory]:

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-directory');

// Synchronous, blocking method
file.make_directory(null);

// Asynchronous, non-blocking method
await new Promise((resolve, reject) => {
    file.make_directory_async(
        GLib.PRIORITY_DEFAULT,
        null,
        (file_, result) => {
            try {
                resolve(file.make_directory_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

Note that this function will not make directories recursively, so you must use
[`Gio.File.make_directory_with_parents()`][gfilemakedirectorywithparents] if you
do want to do this manually:

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-directory');
const child = file.get_child('test-subdirectory');

// Synchronous, blocking method
child.make_directory_with_parents(null);
```

Unfortunately, there is no asynchronous version of this method in GIO.

[gfilecreate]: https://gjs-docs.gnome.org/gio20/gio.file#method-create
[gfileoutputstream]: https://gjs-docs.gnome.org/gio20/gio.fileoutputstream
[gfilemakedirectory]: https://gjs-docs.gnome.org/gio20/gio.file#method-make_directory
[gfilemakedirectorywithparents]: https://gjs-docs.gnome.org/gio20/gio.file#method-make_directory_with_parents


## Simple Reading and Writing

For simple operations like loading the contents of a file or writing contents
out to file, you probably don't want to bother with I/O streams.


### Reading File Contents

To read the contents of a file, you can use
[`Gio.File.load_contents()`][gfileloadcontents]:

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
const [, contents, etag] = file.load_contents(null);

// Asynchronous, non-blocking method
const [, contents, etag] = await new Promise((resolve, reject) => {
    file.load_contents_async(
        null,
        (file_, result) => {
            try {
                resolve(file.load_contents_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

The result of this operation will be a [`Uint8Array`][uint8array]. To convert
this to a string, you can use [`TextDecoder()`][textdecoder] or
`ByteArray.toString()`:

```js
// GJS >= 1.70 (GNOME 41)
const decoder = new TextDecoder('utf-8');
const contentsString = decoder.decode(contents);

// GJS < 1.70 (GNOME 40 or older)
const ByteArray = imports.byteArray;
const contentsString = ByteArray.toString(contents);
```

[gfileloadcontents]: https://gjs-docs.gnome.org/gio20/gio.file#method-load_contents
[textdecoder]: https://developer.mozilla.org/docs/Web/API/TextDecoder
[uint8array]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/uint8array


### Writing File Contents

To write contents to a file, you can use
[`Gio.File.replace_contents()`][gfilereplacecontents]

Note that when writing contents asynchronously, it is strongly advised that you
use [`Gio.File.replace_contents_bytes_async()`][gfilereplacecontentsbytesasync].
Not doing so may lead to file corruption if you are not very careful with the
lifetime of the data.

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
const [, etag] = file.replace_contents('some file contents', null, false,
    Gio.FileCreateFlags.REPLACE_DESTINATION, null);

// Asynchronous, non-blocking method
const [, etag] = await new Promise((resolve, reject) => {
    file.replace_contents_bytes_async(
        new GLib.Bytes('some file contents'),
        null,
        false,
        Gio.FileCreateFlags.REPLACE_DESTINATION,
        null,
        (file_, result) => {
            try {
                resolve(file.replace_contents_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

[gfilereplacecontents]: https://gjs-docs.gnome.org/gio20/gio.file#method-replace_contents
[gfilereplacecontentsbytesasync]: https://gjs-docs.gnome.org/gio20~2.66p/gio.file#method-replace_contents_bytes_async



## Opening File Streams

When you want to perform more complicated operations on files or pipe the data
to or from another source, you can open IO streams for a file instead.

For example, to open file in read-only mode you can use
[`Gio.File.read()`][gfileread]:

```js
const {Gio, GLib} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
const inputStream = file.read(null);

// Asynchronous, non-blocking method
const inputStream = await new Promise((resolve, reject) => {
    file.read_async(
        GLib.PRIORITY_DEFAULT,
        null,
        (file_, result) => {
            try {
                resolve(file.read_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

This will return a [`Gio.FileInputStream`][gfileinputstream] so that you can
follow this call by reading from the stream:

```js
const contentsBytes = await new Promise((resolve, reject) => {
    inputStream.read_bytes_async(
        4096,
        GLib.PRIORITY_DEFAULT,
        null,
        (stream_, result) => {
            try {
                resolve(inputStream.read_bytes_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

To open file in read-write mode instead, you can use
[`Gio.File.open_readwrite()`][gfileopenreadwrite]:

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
const ioStream = file.open_readwrite(null);

// Asynchronous, non-blocking method
const ioStream = await new Promise((resolve, reject) => {
    file.open_readwrite_async(
        GLib.PRIORITY_DEFAULT,
        null,
        (file_, result) => {
            try {
                resolve(file.open_readwrite_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

This will return a [`Gio.FileIOStream`][gfileiostream], which holds both an
`Gio.FileInputStream` you can use for reading and a `Gio.FileOutputStream` you
can use for writing:

```js
const inputStream = ioStream.get_input_stream();
const outputStream = ioStream.get_output_stream();
```

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

```js
const {Gio, GLib} = imports.gi;

const source = Gio.File.new_for_path('test-file.txt');
const target = Gio.File.new_for_path('test-copy.txt');

// Synchronous, blocking method
source.copy(target, Gio.FileCopyFlags.NONE, null, null);

// Asynchronous, non-blocking method
await new Promise((resolve, reject) => {
    source.copy_async(
        target,
        Gio.FileCopyFlags.NONE,
        GLib.PRIORITY_DEFAULT,
        // Gio.FileProgressCallback
        (nWritten, nTotal) => {
            const percent = Math.floor(nWritten / nTotal);
            log(`Progress: ${percent}%`);
        },
        (file_, result) => {
            try {
                resolve(file.copy_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

If you want to move a file instead of copying it, you can use
[`Gio.File.move()`][gfilemove]. Unlike `Gio.File.copy()`, this function can move
entire directories of files.

```js
const {Gio, GLib} = imports.gi;

const source = Gio.File.new_for_path('test-file.txt');
const target = Gio.File.new_for_path('test-move.txt');

// Synchronous, blocking method
source.move(target, Gio.FileCopyFlags.NONE, null, null);

// Asynchronous, non-blocking method
await new Promise((resolve, reject) => {
    source.copy_async(
        target,
        Gio.FileCopyFlags.NONE,
        GLib.PRIORITY_DEFAULT,
        null,
        (file_, result) => {
            try {
                resolve(file.move_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

[gfilecopy]: https://gjs-docs.gnome.org/gio20/gio.file#method-copy
[gfilecopyflags]: https://gjs-docs.gnome.org/gio20/gio.filecopyflags
[gfilemove]: https://gjs-docs.gnome.org/gio20/gio.file#method-move


## Deleting Files

To delete files, you can use [`Gio.File.delete()`][gfiledelete]:

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
file.delete(null);

// Asynchronous, non-blocking method
await new Promise((resolve, reject) => {
    file.delete_async(
        GLib.PRIORITY_DEFAULT,
        null,
        (file_, result) => {
            try {
                resolve(file.delete_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

Note that `Gio.File.delete()` will not delete non-empty directories, nor will it
recursively delete files. To do that you must recursively delete files
manually.

You may, however, use [`Gio.File.trash()`][gfiletrash] to send entire
directories of files to the user's Trash:

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
file.trash(null);

// Asynchronous, non-blocking method
await new Promise((resolve, reject) => {
    file.trash_async(
        GLib.PRIORITY_DEFAULT,
        null,
        (file_, result) => {
            try {
                resolve(file.trash_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

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

```js
const {GLib, Gio} = imports.gi;

const file = Gio.File.new_for_path('test-file.txt');

// Synchronous, blocking method
const info = file.query_info('standard::*',
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null);

// Asynchronous, non-blocking method
const info = await new Promise((resolve, reject) => {
    file.query_info_async(
        'standard::*',
        Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS,
        GLib.PRIORITY_DEFAULT,
        (file_, result) => {
            try {
                resolve(file.query_info_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});
```

For attributes in the `standard` namespace there are convenience methods like
[`Gio.FileInfo.get_size()`][gfileinfogetsize], but others require methods like
[`Gio.FileInfo.get_attribute_uint32()`][gfileinfogetattributeuint32]:

```js
// Attributes in the `standard` namespace
const fileName = info.get_name();
const fileSize = info.get_size();

// Attributes in other namespaces
const unixMode = info.get_attribute_uint32('unix::uid');
```

[gfilequeryinfo]: https://gjs-docs.gnome.org/gio20/gio.file#method-query_info
[gfileinfo]: https://gjs-docs.gnome.org/gio20/gio.fileinfo
[gfileinfogetsize]: https://gjs-docs.gnome.org/gio20/gio.fileinfo#method-get_size
[gfileinfogetattributeuint32]: https://gjs-docs.gnome.org/gio20/gio.fileinfo#method-get_attribute_uint32


## Navigating Files and Directories

Navigating files and directories is quite simple, if you already know what
you're looking for. The [`Gio.File.get_child()`][gfilegetchild] and
[`Gio.File.get_parent()`][gfilegetparent] methods take a string and return a
`Gio.File` object for that path:

```js
const {Gio, GLib} = imports.gi;

// Our starting point, in the current working directory
const cwd = Gio.File.new_for_path('.');

// A child of the directory
const childFile = cwd.get_child('test-file.txt');

// The parent directory
const parentDir = cwd.get_parent();

// A child of the parent directory
const parentFile = parentDir.get_child('parent-file.txt');
```

If you don't know the files you're looking for, you can instead list the files
and iterate them with [`Gio.File.enumerate_children()`][gfileenumeratechildren].
This method will return a [`Gio.FileEnumerator`][gfileenumerator] that you can
call [`Gio.FileEnumerator.next_file()`][gfileenumeratornextfile] on to retrieve
a `Gio.FileInfo` object for each file:

```js
const {Gio, GLib} = imports.gi;

const directory = Gio.File.new_for_path('.');

// Synchronous, blocking method
const iter = directory.enumerate_children('standard::*',
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null);

while (true) {
    const info = iter.next_file(null);
    
    if (info == null)
        break;
        
    log(info.get_name()); 
}

// Asynchronous, non-blocking method
const iter = await new Promise((resolve, reject) => {
    directory.enumerate_children_async(
        'standard::*',
        Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS,
        GLib.PRIORITY_DEFAULT,
        cancellable,
        (file_, result) => {
            try {
                resolve(directory.enumerate_children_finish(result));
            } catch (e) {
                reject(e);
            }
        }
    );
});

while (true) {
    const infos = await new Promise((resolve, reject) => {
        iter.next_files_async(
            10, // max results
            GLib.PRIORITY_DEFAULT,
            null,
            (iter_, res) => {
                try {
                    resolve(iter.next_files_finish(res));
                } catch (e) {
                    reject(e);
                }
            }
        );
    });

    if (infos.length === 0)
        break;
        
    for (const info of infos)
        log(info.get_name());
}
```

[gfilegetchild]: https://gjs-docs.gnome.org/gio20/gio.file#method-get_child
[gfilegetparent]: https://gjs-docs.gnome.org/gio20/gio.file#method-get_parent
[gfileenumeratechildren]: https://gjs-docs.gnome.org/gio20/gio.file#method-enumerate_children
[gfileenumerator]: https://gjs-docs.gnome.org/gio20/gio.fileenumerator
[gfileenumeratornextfile]: https://gjs-docs.gnome.org/gio20/gio.fileenumerator#method-next_file


## Monitoring Files and Directories

It is possible to monitor files and directories for changes with `Gio.File`. You
can use [`Gio.File.monitor()`][gfilemonitor] to monitor a file or directory for
changes.

Be sure to review the [`Gio.FileMonitorFlags`][gfilemonitorflags] documentation,
to select the correct flags for the operations you want to monitor.

```js
const {Gio, GLib} = imports.gi;

const directory = Gio.File.new_for_path('.');

const fileMonitor = directory.monitor(Gio.FileMonitorFlags.WATCH_MOVES, null);

fileMonitor.connect('changed', (fileMonitor, file, otherFile, eventType) => {
    switch (eventType) {
        case Gio.FileMonitorEvent.CHANGED:
            log(`${otherFile.get_basename()} was changed`);
            break;
            
        case Gio.FileMonitorEvent.DELETED:
            log(`${otherFile.get_basename()} was deleted`);
            break;
            
        case Gio.FileMonitorEvent.CREATED:
            log(`${otherFile.get_basename()} was created`);
            break;
            
        case Gio.FileMonitorEvent.MOVED_IN:
            log(`${otherFile.get_basename()} was moved into the directory`);
            break;
            
        case Gio.FileMonitorEvent.MOVED_OUT:
            log(`${otherFile.get_basename()} was moved out of the directory`);
            break;
    }
});
```

Note that you **must** hold a reference to the returned
[`Gio.FileMonitor`][gfilemonitorobj] object.

[gfilemonitor]: https://gjs-docs.gnome.org/gio20/gio.file#method-monitor
[gfilemonitorobj]: https://gjs-docs.gnome.org/gio20/gio.filemonitor
[gfilemonitorflags]: https://gjs-docs.gnome.org/gio20/gio.filemonitorflags


## Complex Examples

A few more complex examples may be useful, to show how `Gio.File` can be used to
solve large or complicated problems without blocking the main thread.


### Recursively Deleting a Directory

Although `Gio.File.trash()` may be used to send non-empty directories to the
Trash, deleting an entire directory of files is still a pretty common task.

It is also useful way to demonstrate how to walk a tree of files and call a
function on each file based on its type.

```js
const {GLib, Gio} = imports.gi;


// Note that we could inline this function, but we will make it discrete to show
// how you can recursively call any function on files and folders.
function deleteFile(file, cancellable = null) {
    return new Promise((resolve, reject) => {
        file.delete_async(
            GLib.PRIORITY_DEFAULT,
            cancellable,
            (_file, res) => {
                try {
                    resolve(file.delete_finish(res));
                } catch (e) {
                    reject(e);
                }
            }
        );
    });
}

/**
 * Recursively delete @file and any children it may have.
 *
 * @param {Gio.File} file - the file or directory to delete
 * @param {Gio.Cancellable} [cancellable] - optional cancellable
 * @return {Promise} a Promise for the operation
 */
async function deleteDirectory(file, cancellable = null) {
    try {
        const iter = await new Promise((resolve, reject) => {
            file.enumerate_children_async(
                'standard::type',
                Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS,
                GLib.PRIORITY_DEFAULT,
                cancellable,
                (_file, res) => {
                    try {
                        resolve(_file.enumerate_children_finish(res));
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        });

        // We'll collect all the branches and operate on them in parallel
        const branches = [];

        while (true) {
            const infos = await new Promise((resolve, reject) => {
                iter.next_files_async(
                    10, // max files
                    GLib.PRIORITY_DEFAULT,
                    cancellable,
                    (_iter, res) => {
                        try {
                            resolve(_iter.next_files_finish(res));
                        } catch (e) {
                            reject(e);
                        }
                    }
                );
            });

            // If none are returned, we're done here
            if (infos.length === 0)
                break;

            // The type of file will determine whether to recurse or not
            for (const info of infos) {
                const child = iter.get_child(info);
                const type = info.get_file_type();

                let branch;

                switch (type) {
                    case Gio.FileType.REGULAR:
                    case Gio.FileType.SYMBOLIC_LINK:
                        branch = deleteFile(child, cancellable);
                        break;

                    case Gio.FileType.DIRECTORY:
                        branch = deleteDirectory(child, cancellable);
                        break;

                    default:
                        continue;
                }

                branches.push(branch);
            }
        }

        await Promise.all(branches);
    } catch (e) {
        // We may ignore these errors, since a missing file does not need to be
        // deleted, and we may ignore a failure to recurse into a regular file
        if (!e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.NOT_FOUND) &&
            !e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.NOT_DIRECTORY))
            throw e;
    } finally {
        // We can return the Promise for deleting the top-level file
        return deleteFile(file, cancellable);
    }
}
```

