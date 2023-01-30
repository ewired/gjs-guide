---
title: Asynchronous Programming
---

# Asychronous Programming

JavaScript is a single-threaded, concurrent programming language. Concurrency is
achieved by using an event loop that halts while processing an event, before
returning to process more events.

The [`Promise`][promise] API is a powerful framework for controlling execution
flow in an event loop, while keeping code simple and maintainable.

Although JavaScript can only be run in a single-thread environment, the GNOME
APIs contain many functions that use per-task threads to execute blocking
operations.

Using these three tools together allows GJS programmers to schedule events based
on their priority, keep code clean and understandable, and indirectly use
threads to write responsive and performant code.

[promise]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise


## The Main Loop

In order to process events in a concurrent fashion, a JavaScript engine needs an
event loop. Although GJS is powered by Firefox's [SpiderMonkey][spidermonkey]
JavaScript engine, it uses GLib's [Event Loop][mainloop]. The event loop is the
foundation of concurrent and asynchronous programming in GJS, so we will cover
it in some detail.

If you are writing an application using [`Gio.Application`][gapplication] or one
of its subclasses like `Gtk.Application` or `Adw.Application`, a main loop will
be started for you when you call [`Gio.Application.run()`][gapplicationrun]. If
you are writing a GNOME Shell Extension, you will be using the main loop already
running in GNOME Shell.

It's still useful to know how to create a main loop for simple scripts, so let's
get started with an example of creating a `GLib.MainLoop` and adding a timeout
source:

```js
const {GLib} = imports.gi;

// Here we're creating an event loop, to iterate the main context
const loop = new GLib.MainLoop(null, false);

// Here we're adding a timeout source to the main context that executes a
// callback after one second. The returned ID can be used to remove the source.
const sourceId = GLib.timeout_add_seconds(
    GLib.PRIORITY_DEFAULT,           // priority of the source
    1,                               // seconds to wait
    () => {                          // the callback to invoke
        return GLib.SOURCE_CONTINUE; // the return value; to recurse or not?
    }
);

// Here we're starting the loop, instructing it to process sources (events)
loop.run();
```

If you run that example as a script it would never exit, because the loop is
never instructed to quit. The example below will iterate the main context for
one second, before instructing the loop to quit:

```js
const {GLib} = imports.gi;

const loop = new GLib.MainLoop(null, false);

const sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    loop.quit();
    
    return GLib.SOURCE_REMOVE;
});

log('Starting the main loop');

// This function will return when GLib.MainLoop.quit() is called
loop.run();

log('The main loop stopped');
```

[spidermonkey]: https://spidermonkey.dev
[mainloop]: https://docs.gtk.org/glib/main-loop.html
[gapplication]: https://gjs-docs.gnome.org/gio20/gio.application
[gapplicationrun]: https://gjs-docs.gnome.org/gio20/gio.application#method-run


### Event Sources

There are many types of sources in GLib and you may even create your own, but the
two most common you will create explicitly are timeout sources and idle sources:

```js
const {GLib} = imports.gi;

const loop = new GLib.MainLoop(null, false);

// Timeout sources execute a callback when the interval is reached
const timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    log('This callback was invoked because the timeout was reached');
    
    return GLib.SOURCE_REMOVE;
});


// Idle sources execute a callback when no other sources with a higher priority
// are ready.
const idleId = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
    log('This callback was invoked because no other sources were ready');
    
    return GLib.SOURCE_REMOVE;
});

loop.run();
```

Sources can also be created implicitly, like when calling the asynchronous
methods found in GIO. These functions usually execute tasks in a background
thread, then once they complete add a `GLib.Source` to the caller's main context
to invoke a callback:

```js
const {GLib, Gio} = imports.gi;

const loop = new GLib.MainLoop(null, false);
const file = Gio.File.new_for_path('test-file.txt');

// GTask-based operations invoke a callback when the task completes
file.delete_async(GLib.PRIORITY_DEFAULT, null, (file, result) => {
    log('This callback was invoked because the task completed');
    
    try {
        file.delete_finish(result);
    } catch (e) {
        logError(e);
    }
});

loop.run();
```

Here's one more, slightly more advanced example. In this case, we'll create a
input stream for `stdin` (that's the stream you use when you type in a terminal)
then use it to create a source that triggers when the user presses `Enter`:

```js
const {GLib, Gio} = imports.gi;

const loop = new GLib.MainLoop(null, false);

const stdinDecoder = new TextDecoder('utf-8');
const stdinStream = new Gio.UnixInputStream({fd: 0});

// Here we create a GLib.Source using Gio.PollableInputStream.create_source(),
// set the priority and callback, then add it to main context
const stdinSource = stdinStream.create_source(null);
stdinSource.set_priority(GLib.PRIORITY_DEFAULT);
stdinSource.set_callback(() => {
    try {
        const data = stdinStream.read_bytes(4096, null).toArray();
        const text = stdinDecoder.decode(data).trim();
        
        print(`You typed: ${text}`);

        return GLib.SOURCE_CONTINUE;
    } catch (e) {
        logError(e);

        return GLib.SOURCE_REMOVE;
    }
});
const sourceId = stdinSource.attach(null);

// Start processing input
loop.run();
```


### Event Priority

Each event source will have a priority, to determine which will get "dispatched"
if more than one is ready at the same time. Priorities are simply positive or
negative `Number` values; the lower the number the higher the priority.

Consider the table of common priorities below. In particular, notice how
`Gtk.PRIORITY_RESIZE` has a higher priority than `Gdk.PRIORITY_REDRAW` so that a
`Gtk.Window` isn't redrawn for every little step resizing:


| Constant                     | Value |
|------------------------------|-------|
| `GLib.PRIORITY_LOW`          |  300  |
| `GLib.PRIORITY_DEFAULT_IDLE` |  200  |
| `Gdk.PRIORITY_REDRAW`        |  120  |
| `Gtk.PRIORITY_RESIZE`        |  110  |
| `GLib.PRIORITY_HIGH_IDLE`    |  100  |
| `GLib.PRIORITY_DEFAULT`      |    0  |
| `GLib.PRIORITY_HIGH`         | -100  |

In the example below, we will add two timeout sources that resolve at the same
time, but with differing priorities so that one is dispatched first:

```js
const {GLib} = imports.gi;

const loop = new GLib.MainLoop(null, false);

const idleId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT_IDLE, 1, () => {
    log('idle source');
    
    return GLib.SOURCE_REMOVE;
});

const defaultId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    log('default source');
    
    return GLib.SOURCE_REMOVE;
});

loop.run();
```

### Removing Sources

There are two ways you can remove a source from the loop, if it was added with
`GLib.timeout_add()` or `GLib.idle_add()`.

Both of these functions return an opaque value, just like a signal connection.
This value can be passed to [`GLib.Source.remove()`][gsourceremove], after which
the source will be removed from the main context and the callback will not be
invoked.

The other way depends on the return value of the source callback. If the
callback returns `GLib.SOURCE_CONTINUE` the callback will be invoked again when
the source's condition is met. If it returns `GLib.SOURCE_REMOVE`, the source
will be removed and the callback will never be invoked again.

```js
const {GLib} = imports.gi;

const loop = new GLib.MainLoop(null, false);

const idleId = GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
    log('This callback will only be invoked once.');
    
    return GLib.SOURCE_REMOVE;
});

const timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    log('This callback will be invoked once per second, until removed');
    
    return GLib.SOURCE_CONTINUE;
});

const removeId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
    log('This callback will be invoked once to remove the first timeout after 5 seconds');
    
    GLib.Source.remove(timeoutId);
    
    return GLib.SOURCE_REMOVE;
});

loop.run();
```

Other event sources, like those created by asynchronous methods in GIO, can not
be removed directly. Most operations may be cancelled however, by passing a
[`Gio.Cancellable`][gcancellable].


[gsourceremove]: https://gjs-docs.gnome.org/glib20/glib.source#function-remove
[gcancellable]: https://gjs-docs.gnome.org/gio20/gio.cancellable


## Promises

In GJS, a [`Promise`][mdnpromise] is basically an event source that triggers
when the `resolve()` or `reject()` functions are invoked. If you are new to
`Promise` and `async` in JavaScript, you should review the following articles on
MDN:

* [Using promises](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises)
* [`async`/`await`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)

This section will only briefly cover `Promise` usage in JavaScript and GJS.

[mdnpromise]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise


### Traditional Usage

```js
const {GLib} = imports.gi;

const loop = new GLib.MainLoop(null, false);


// Returns a Promise that randomly fails or succeeds after one second
function unreliablePromise() {
    return new Promise((resolve, reject) => {
        GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            if (Math.random() >= 0.5)
                resolve('success');
            else
                reject(Error('failure'));
            
            return GLib.SOURCE_REMOVE;
        });
    });
}


// When using a Promise in the traditional manner, you must chain to it with
// `then()` to get the result and `catch()` to trap errors.
unreliablePromise().then(result => {
    // Logs "success"
    log(result);
}).catch(e => {
    // Logs "Error: failure"
    logError(e);
});


// A convenient short-hand in GJS is just passing `logError` to `catch()`
unreliablePromise().catch(logError);


loop.run();
```

### `async`/`await`

Although `Promise` objects offer a simple API for asynchronous operations, they
still have the burden of callbacks.

With the `async`/`await` paradigm, programmers can regain the simplicity of
synchronous programming, with the benefits of asynchronous execution.

```js
const {GLib} = imports.gi;

const loop = new GLib.MainLoop(null, false);


// Returns a Promise that randomly fails or succeeds after one second
function unreliablePromise() {
    return new Promise((resolve, reject) => {
        GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            if (Math.random() >= 0.5)
                resolve('success');
            else
                reject(Error('failure'));
            
            return GLib.SOURCE_REMOVE;
        });
    });
}


// An example async function, demonstrating how Promises can be resolved
// sequentially while catching errors in a try..catch block.
async function exampleAsyncFunction() {
    try {
        let count = 0;
        
        while (true) {
            await unreliablePromise();
            log(`Promises resolved: ${++count}`);
        }
    } catch (e) {
        logError(e);
        loop.quit();
    }
}


// Run the async function
exampleAsyncFunction();


loop.run();
```


## Asynchronous Operations

While you can not run JavaScript on multiple threads, almost all GIO operations
have asynchronous variants. These work by collecting the necessary input in the
function arguments, sending the work to be done on another thread, then they
invoke a callback in the main thread when finished.


### Traditional Usage

Although written in JavaScript, the example below is how a C programmer will
typically use these functions.

While this won't block the main thread for the duration of the operation, it is
awkward compared to the modern programming styles usually used in high-level
languages like JavaScript.


```js
const {GLib, Gio} = imports.gi;

const loop = new GLib.MainLoop(null, false);
const file = Gio.File.new_for_path('test-file.txt');

// This callback will be invoked once the operation has been completed
function loadContentsCb(file, result) {
    try {
        const [, contents] = file.load_contents_finish(result);
        
        log(`Read ${content.length} bytes from ${file.get_basename()}`);
    } catch (e) {
        logError(e, `Reading ${file.get_basename()}`);
    }
}

// This function takes the GFile object as input, reads the contents in another
// thread, then invokes loadContentsCb() in the main thread.
file.load_contents_async(GLib.PRIORITY_DEFAULT, null, loadContentsCb);

loop.run();
```


### `async`/`await`

One of the most convenient uses of `Promise` for GJS programmers, is to wrap
these asynchronous functions and use the `async`/`await` pattern to regain
synchronous flow:

```js
const {GLib, Gio} = imports.gi;

// This convenience function returns the same operation wrapped in a Promise
function loadContents(file) {
    return new Promise((resolve, reject) => {
        file.load_contents_async(GLib.PRIORITY_DEFAULT, null, (file_, res) => {
            try {
                const [, contents] = file.load_contents_finish(result);
                
                // If the task succeeds, we can return the result with resolve()
                resolve(contents);
            } catch (e) {
                // If an error occurred, we can report it using reject()
                reject(e);
            }
        });
    });
}

// Here is the synchronous, blocking form of this operation
function exampleSyncFunction() {
    try {
        const file = Gio.File.new_for_path('test-file.txt');
        const [, contents] = file.load_contents(null);
        
        log(`Read ${contents.length} bytes from ${file1.get_basename()}`);
    } catch (e) {
        logError(e, `Reading ${file.get_basename()}`);
    }
}

// Here is our asynchronous, non-blocking wrapper in use
async function exampleAsyncFunction() {
    try {
        const file = Gio.File.new_for_path('test-file.txt');
        const contents = await loadContents(file);
        
        log(`Read ${contents.length} bytes from ${file1.get_basename()}`);
    } catch (e) {
        logError(e, `Reading ${file.get_basename()}`);
    }
}
```

The important thing to notice is that by using the `async`/`await` pattern, you
can maintain a simple, synchronous-like programming style while taking advantage of
asynchronous execution.

With a wrapper function prepared, you can even run many of these operations in
parallel; each in its own thread:


```js
async function loadMultipleFiles() {
    try {
        // A list of files to read
        const files = [
            Gio.File.new_for_path('test-file1.txt'),
            Gio.File.new_for_path('test-file2.txt'),
            Gio.File.new_for_path('test-file3.txt'),
        ];
        
        // Creating a Promise for each operation
        const operations = files.map(file => loadContents(file));
        
        // Run them all in parallel
        const results = await Promise.all(operations);
        
        results.forEach((result, i) => {
            log(`Read ${result.length} bytes from "${files[i].get_basename()}"`);
        });
    } catch (e) {
        logError(e);
    }
}
```


### Promisify Helper

In GJS 1.54 a convenient helper was added as a technology preview, based on the
work of Outreachy intern [Avi Zajac][avizajac]. Ultimately, GJS will have
seamless support for async functions, but until then you can use the
"promisify" helper to automatically create `Promise` wrappers.

The `Gio._promisify()` utility replaces the original function on the class
prototype, so that it can be called on any instance of the class, including
subclasses. Simply pass the class prototype, the "async" function name and the
"finish" function name as arguments:

```js
const {Gio} = imports.gi;

Gio._promisify(Gio.InputStream.prototype, 'read_bytes_async',
    'read_bytes_finish');
```

The function may then be used like any other `Promise` without the need for a
custom wrapper, simply by leaving out the callback argument:

```js
try {
    const inputStream = new Gio.UnixInputStream({fd: 0});
    const bytes = await inputStream.read_bytes_async(4096,
        GLib.PRIORITY_DEFAULT, null);
} catch (e) {
    logError(e, 'Failed to read bytes');
}
```

The original function will still be available, and can be used simply by passing
the callback:

```js
const inputStream = new Gio.UnixInputStream({fd: 0});

inputStream.read_bytes_async(
    4096,
    GLib.PRIORITY_DEFAULT,
    null,
    (stream_, result) => {
        try {
            const bytes = inputStream.read_bytes_finish(result);
        } catch (e) {
            logError(e, 'Failed to read bytes');
        }
    }
);
```

[avizajac]: https://llzes.org/


### Cancelling Operations

One benefit of GIO's asynchronous methods, is the ability to cancel them after
they have started. This is done by using a [`Gio.Cancellable`][gcancellable]
object, which can be triggered from any thread.


```js
const {GLib, Gio} = imports.gi;

const loop = new GLib.MainLoop(null, false);
const file = Gio.File.new_for_path('test-file.txt');


// The callback will be invoked once the operation has been completed, even if
// it was cancelled.
function loadContentsCb(file, result) {
    try {
        const [, contents] = file.load_contents_finish(result);
        
        log(`Read ${content.length} bytes from ${file.get_basename()}`);
    } catch (e) {
        // If the operation was cancelled we probably did it on purpose, in
        // which case we may just want to mute the error
        if (!e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
            logError(e, `Reading ${file.get_basename()}`);
    }
}

// This is cancellable we will pass to the asynchronous method. We need to hold
// a reference to this somewhere if we want to cancel it.
const cancellable = new Gio.Cancellable();

// Start the operation
file.load_contents_async(GLib.PRIORITY_DEFAULT, cancellable, loadContentsCb);

// Cancel the operation by triggering the cancellable
cancellable.cancel();

loop.run();
```

You may pass the same `Gio.Cancellable` object to as many operations as you
want, and cancel them all with a single call to `Gio.Cancellable.cancel()`. This
can be useful if many operations depend on a single state, such as a GNOME Shell
Extension being enabled or disabled.

Once a `Gio.Cancellable` has been cancelled, you should drop the reference to it
and create a new instance for future operations.

[gcancellable]: https://gjs-docs.gnome.org/gio20/gio.cancellable

