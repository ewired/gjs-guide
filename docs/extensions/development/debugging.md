---
title: Debugging
---

# Debugging

When an extension is enabled it is effectively applied like a patch, and so
enabled extensions become a part of the GNOME Shell process. As a result,
debugging extensions can sometimes involve non-standard methods.

This document will explain the basic workflow required to develop, test and
debug GNOME Shell extensions.

## Reloading Extensions

Unlike frameworks that can load and unload plugins or shared libraries,
JavaScript engines can not "unload" code from the interpreter. This means a new
GNOME Shell process must be started to load changes in an extension, and ensure
a clean environment for testing the new code.

### Running a Nested GNOME Shell

::: warning
A nested instance of GNOME Shell is not fully isolated, and will not protect
your system from data loss or other consequences.
:::

Wayland desktops can run a nested instance of GNOME Shell, similar to running a
virtual machine, except only the `gnome-shell` process is run and there is very
little isolation.

A nested instance is wrapped in a new D-Bus session, which allows GNOME Shell to
export D-Bus services and other tasks that would normally conflict with the host
system. Start a nested instance by running the command below in a new terminal:

```sh
dbus-run-session -- gnome-shell --nested --wayland
```

GNOME Shell and Mutter will log many debug messages and harmless warnings to the
terminal, and display a new desktop in a window. The process can be further
controlled by setting environment variables used when
[Running GLib Applications](https://docs.gtk.org/glib/running.html) and
specifically the `MUTTER_DEBUG_DUMMY_MODE_SPECS` varaible which can be used to
set the display resolution:

@[code sh](@src/extensions/development/debugging/gnome-nested.sh)

### Restarting GNOME Shell

::: tip
Wayland sessions can not restart GNOME Shell while the user is logged in, so
you must log out and log back in to restart the `gnome-shell` process.
:::

X11 desktops can't run a nested instance of GNOME Shell, but can be restarted
without having to log out and log back in. Before restarting, be sure to have
a terminal open for [logging](#logging).

Start by pressing `Alt`+`F2` to open the ***Run a Command*** dialog, then enter
the built-in command `restart`. GNOME Shell will restart, reloading all
extensions, while logging debug messages, warnings and errors.

## Logging

::: tip
You may be required to be part of a `systemd` user group to access logs. Systems
that are not using `systemd` may write logs to `~/.xsession-errors`.
:::

This section explains logging with a focus on GNOME Shell extensions. There is
more complete documentation for [Logging][logging-docs] available in the
[API Documentation](https://gjs-docs.gnome.org).

### Recommended Practices

The [`console`][console-docs] API is the recommended method for logging, using a
function determined by log level. For example, `console.debug()` must always be
used for information only useful during development, while `console.warn()`
should only be used to log warnings that may indicate a bug.

For logging an `Error` as a warning message with a stack trace, the built-in
function [`logError()`][logging-logerror] is still a convenient choice:

```js
Promise.reject().catch(logError);

try {
    throw new Error('example');
} catch (e) {
    logError(e, 'Prefix');
}
```

The best practice is to keep logging to a minimum, focusing on unexpected events
and failures. All logged messages are included in the system log, so excessive
logging can even make debugging other applications more difficult.

### Filtering by Extension

::: warning
This feature has limited usefulness, because it silences other messages from
GNOME Shell and only works with the built-in [`log()`][logging-log] function
(not [`console.log()`][console-log]).
:::

GNOME Shell extensions have a special feature available that can be used with
`journald`. When the `GNOME_SHELL_EXTENSION_UUID` variable is set to your
extension's UUID, it will filter out all messages except those logged by your
extension with the global [`log()`][logging-log] function:

```sh
$ journalctl -f -o cat GNOME_SHELL_EXTENSION_UUID=example@gjs.guide
```

## Looking Glass

Looking Glass is a debugger and inspector, built into GNOME Shell. Note that it
is not a stepping debugger like the one started by `gjs --debugger`, but more
like the inspector in GTK.

To open Looking Glass, start by pressing `Alt`+`F2` to open the
***Run a Command*** dialog, then enter the built-in command `lg`.

### Evaluator

The *Evaluator* page is the default page of Looking Glass, and a unique REPL
console that can run arbitrary JavaScript in the current GNOME Shell process. It
has command history, tab completion and automatically saves the return values of
expressions and function calls.

The libraries `GLib`, `GObject`, `Gio`, `Clutter`, `Meta`, `St` and `Shell` are
imported. Additionally, the following are defined:

* `stage` - An alias for `global.stage`
* `Main` - An alias for `imports.ui.main`
* `inspect(x = 0, y = 0)` - Get the `Clutter.Actor` at `(x, y)`
* `r(index = 0)` - Get the return value of a previous command at `index`

Each line is executed separately, so multiple expressions and function calls
must be joined by a semi-colon (`;`). For example:

```
>>> const sum = 2 + 2; const square = sum * sum; return `Sum: ${sum}, Square: ${square}`;
r(0) = Sum: 4, Square: 16
>>> Main.panel
r(1) = [0x55b300338460 Gjs_ui_panel_Panel:first-child last-child "panel"]
```

Clicking `[0x55b300338460 Gjs_ui_panel_Panel:first-child last-child "panel"]`
will open a dialog with the object's properties, including links to other
objects. In the top-left corner of Looking Glass there is a button with a target
icon (`⌖`), which allows you to select an actor with the mouse and calls the
`inspect()` function for you:

```
>>> 2 + 2
r(0) = 4
>>> Main.panel
r(1) = [0x55b300338460 Gjs_ui_panel_Panel:first-child last-child "panel"]
>>> inspect(1028, 26)
r(2) = [0x55b3003a3d30 Gjs_ui_dateMenu_DateMenuButton.panel-button clock-display:first-child last-child "(Jun 8 17:43)"]
```

### Windows

The *Windows* page lists the open windows in the current session. Clicking on
the window title opens the inspector for the `Meta.Window` object, and clicking
on the `.desktop` file name opens it for the `Shell.App` object.

### Extensions

The *Extensions* page lists the extensions in the current session. It displays
the status of the extension, such as *"Enabled"* or *"Downloading"*, and buttons
to view any errors, open the source directory and visit the extension's website.

### Actors

The *Actors* page allows browsing all the widgets in the shell as a tree of
objects. This is sometimes necessary to acquire a reference to an actor that is
hidden from sight, or a non-visual object that exists as a property of an actor.

### Flags

The *Flags* page contains many debugging options for Clutter and Mutter. These
options are generally reserved for GNOME Shell development, and should be used
with care.

## GJS Console

::: tip
The GJS console is a separate process, without access to the `gnome-shell`
process or the ability to import JavaScript modules used by extensions.
:::

Similar to Node.js, GJS also has a REPL shell (Read-Evalute-Print-Loop) that can
be used to test simple pieces of code:

```sh
$ gjs-console

gjs> log('a message');
Gjs-Message: 06:46:03.487: JS LOG: a message

gjs> try {
....     throw new Error('example');
.... } catch (e) {
....     logError(e, 'Prefix');
.... }

(gjs-console:9133): Gjs-WARNING **: 06:47:06.311: JS ERROR: Prefix: Error: example
@typein:2:16
@<stdin>:1:34
gjs> ^C
(To exit, press Ctrl+C again or Ctrl+D)
$
```

## GDB and Extensions

::: warning
This is advanced documentation and not a tutorial about how to use `gdb`.
:::

GJS provides bindings between JavaScript and the GNOME platform, which is
written largely in C. This means that there may always be ways to crash a GJS
process, despite being a high-level memory-safe language.

GJS has a built-in stepping debugger for JavaScript, but the `gnome-shell`
binary is not a JavaScript document that it can run. Instead, a debugger like
`gdb` can be used to start the process:

```sh
$ dbus-run-session -- gdb --args gnome-shell --nested --wayland
```

Be sure to install any missing debug symbols, including those for mozjs, then
enter `run` at the prompt:

```sh
(gdb) run
Starting program: /usr/bin/gnome-shell --nested --wayland
...
Thread 1 "gnome-shell" received signal SIGTRAP, Trace/breakpoint trap.
JS::MutableHandle<JS::Value>::set (v=..., this=<optimized out>, this=<optimized out>, v=...) at /usr/include/mozjs-102/js/RootingAPI.h:708

(gdb) backtrace
#0  JS::MutableHandle<JS::Value>::set(JS::Value const&) (v=<optimized out>, this=<optimized out>, this=<optimized out>, v=<optimized out>) at /usr/include/mozjs-102/js/RootingAPI.h:708
#1  js::MutableWrappedPtrOperations<JS::Value, JS::MutableHandle<JS::Value> >::set(JS::Value const&) (v=<optimized out>, this=<optimized out>, this=<optimized out>, v=<optimized out>) at /usr/include/mozjs-102/js/Value.h:1285
#2  js::MutableWrappedPtrOperations<JS::Value, JS::MutableHandle<JS::Value> >::setUndefined() (this=<optimized out>, this=<optimized out>) at /usr/include/mozjs-102/js/Value.h:1290
#3  gjs_breakpoint(JSContext*, unsigned int, JS::Value*) (context=0x555555902940, argc=0, vp=0x55555699d998) at ../modules/system.cpp:115
#4  0x00007ffff5d4d0c0 in CallJSNative(JSContext*, bool (*)(JSContext*, unsigned int, JS::Value*), js::CallReason, JS::CallArgs const&)
    (args=..., reason=js::CallReason::Call, native=0x7ffff7824840 <gjs_breakpoint(JSContext*, unsigned int, JS::Value*)>, cx=0x555555902940) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:420
#5  js::InternalCallOrConstruct(JSContext*, JS::CallArgs const&, js::MaybeConstruct, js::CallReason) (cx=0x555555902940, args=..., construct=<optimized out>, reason=js::CallReason::Call)
    at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:507
#6  0x00007ffff5d412fc in InternalCall (reason=<optimized out>, args=<optimized out>, cx=<optimized out>) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:574
#7  js::CallFromStack(JSContext*, JS::CallArgs const&) (args=<optimized out>, cx=<optimized out>) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:578
#8  Interpret(JSContext*, js::RunState&) (cx=0x555555902940, state=...) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:3314
#9  0x00007ffff5d4cc19 in js::RunScript(JSContext*, js::RunState&) (cx=cx@entry=0x555555902940, state=...) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:389
#10 0x00007ffff5d4d188 in js::InternalCallOrConstruct(JSContext*, JS::CallArgs const&, js::MaybeConstruct, js::CallReason) (cx=0x555555902940, args=..., construct=js::NO_CONSTRUCT, reason=js::CallReason::Call)
    at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:539
#11 0x00007ffff61ce87c in InternalCall (reason=js::CallReason::Call, args=..., cx=0x555555902940) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:574
#12 js::CallFromStack(JSContext*, JS::CallArgs const&) (args=..., cx=0x555555902940) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/vm/Interpreter.cpp:578
#13 js::jit::DoCallFallback(JSContext*, js::jit::BaselineFrame*, js::jit::ICFallbackStub*, unsigned int, JS::Value*, JS::MutableHandle<JS::Value>)
    (cx=0x555555902940, frame=0x7fffffffc4d0, stub=0x555556f55f00, argc=<optimized out>, vp=0x7fffffffc460, res=...) at /usr/src/debug/mozjs102-102.9.0-1.fc38.x86_64/jit/BaselineIC.cpp:1582
#14 0x0000291c4f15de28 in  ()
#15 0x00007fffffffc518 in  ()
#16 0x00007fffffffc420 in  ()
#17 0xfff9800000000000 in  ()
#18 0x00007ffff66a6828 in _ZN2js3jitL11vmFunctionsE.lto_priv.0 () at /lib64/libmozjs-102.so.0
#19 0x0000291c4f1631a2 in  ()
#20 0x0000000000004022 in  ()
#21 0x00007fffffffc4d0 in  ()
#22 0x0000555556f55f00 in  ()
#23 0x0000000000000000 in  ()
```

Depending on the problem being debugged, the call stack from SpiderMonkey and
GNOME Shell may not provide useful or sufficient information. To print the call
stack of the JavaScript being executed, you can call `gjs_dumpstack()`:

```sh
(gdb) call gjs_dumpstack()
== Stack trace for context 0x5555558f1820 ==
#0   55555699d920 i   /home/user/.local/share/gnome-shell/extensions/example@gjs.guide/extension.js:61 (32611242a790 @ 85)
#1   7fffffffc520 b   resource:///org/gnome/shell/ui/extensionSystem.js:196 (27cfeb5139c0 @ 813)
#2   55555699d7a8 i   resource:///org/gnome/shell/ui/extensionSystem.js:398 (27cfeb513e20 @ 450)
#3   55555699d708 i   self-hosted:1429 (15798debf6a0 @ 30)
#4   7fffffffce30 b   self-hosted:632 (3343399f2420 @ 15)
```

The breakpoint trapped above was set in the extension's code with
[`System.breakpoint()`][system-breakpoint], which is a convenient way to halt
the process at a position in the JavaScript source, allowing you to manually
step through the `gnome-shell` process while dumping the JavaScript stack.

Many problems require tracking the source of a message logged at the "warning"
or "critical" level (`console.warn()` and `console.error()`, respectively). To
automatically break at these points, you can set the `G_DEBUG` environment
variable to `fatal-warnings` or `fatal-criticals`.

The breakpoint trapped below was triggered by the same line in the extension's
code, but this time with `console.error('Serious Stuff!')`:

```sh
(gdb) set env G_DEBUG=fatal-criticals
(gdb) run
Starting program: /usr/bin/gnome-shell --nested --wayland
...
Thread 1 "gnome-shell" received signal SIGTRAP, Trace/breakpoint trap.
_g_log_abort (breakpoint=<optimized out>) at ../glib/gmessages.c:555
555         G_BREAKPOINT ();

(gdb) backtrace
#0  _g_log_abort (breakpoint=<optimized out>) at ../glib/gmessages.c:555
#1  g_log_writer_default (log_level=10, log_level@entry=G_LOG_LEVEL_CRITICAL, fields=fields@entry=0x555556f68d30, n_fields=n_fields@entry=6, user_data=0x0) at ../glib/gmessages.c:2812
#2  0x0000555555558703 in default_log_writer (log_level=G_LOG_LEVEL_CRITICAL, fields=0x555556f68d30, n_fields=6, user_data=<optimized out>) at ../src/main.c:376
#3  0x00007ffff7946994 in g_log_structured_array (n_fields=6, fields=0x555556f68d30, log_level=G_LOG_LEVEL_CRITICAL) at ../glib/gmessages.c:1983
#4  g_log_structured_array (log_level=log_level@entry=G_LOG_LEVEL_CRITICAL, fields=0x555556f68d30, n_fields=6) at ../glib/gmessages.c:1956
#5  0x00007ffff794c031 in g_log_variant (fields=<optimized out>, log_level=G_LOG_LEVEL_CRITICAL, log_domain=<optimized out>) at ../glib/gmessages.c:1920
#6  g_log_variant (log_domain=<optimized out>, log_level=G_LOG_LEVEL_CRITICAL, fields=<optimized out>) at ../glib/gmessages.c:1845
#7  0x00007ffff6a30be6 in ffi_call_unix64 () at ../src/x86/unix64.S:104
#8  0x00007ffff6a2d4bf in ffi_call_int (cif=cif@entry=0x7fffd0008230, fn=<optimized out>, rvalue=<optimized out>, avalue=<optimized out>, closure=closure@entry=0x0) at ../src/x86/ffi64.c:673
#9  0x00007ffff6a3018e in ffi_call (cif=0x7fffd0008230, fn=<optimized out>, rvalue=<optimized out>, avalue=<optimized out>) at ../src/x86/ffi64.c:710
#10 0x00007ffff77d32f7 in Gjs::Function::invoke(JSContext*, JS::CallArgs const&, JS::Handle<JSObject*>, _GIArgument*) (this=0x7fffd0008210, context=context@entry=0x555555902210, args=..., this_obj=..., r_value=r_value@entry=0x0)
    at ../gi/function.cpp:995
#11 0x00007ffff77dd9a9 in Gjs::Function::call(JSContext*, unsigned int, JS::Value*) (context=0x555555902210, js_argc=<optimized out>, vp=<optimized out>) at ../gi/function.cpp:1175
#12 0x0000097b2bde4a6d in  ()
#13 0x0000000000000006 in  ()
#14 0x00007fffffffae68 in  ()
#15 0x0000000000000002 in  ()
#16 0x0000000000000000 in  ()

(gdb) call gjs_dumpstack()
== Stack trace for context 0x5555558f1180 ==
#0   7fffffffaf60 b   resource:///org/gnome/gjs/modules/core/overrides/GLib.js:363 (22a14b380c90 @ 352)
#1   5555569a03c8 i   resource:///org/gnome/gjs/modules/esm/console.js:592 (22a14b373380 @ 1948)
#2   5555569a02c0 i   resource:///org/gnome/gjs/modules/esm/console.js:389 (22a14b3732e0 @ 357)
#3   5555569a0228 i   resource:///org/gnome/gjs/modules/esm/console.js:132 (22a14b36cbf0 @ 39)
#4   7fffffffba30 b   self-hosted:1121 (22a14b373f60 @ 432)
#5   5555569a0190 i   /home/user/.local/share/gnome-shell/extensions/example@gjs.guide/extension.js:61 (33fcaf52a790 @ 85)
#6   7fffffffc4f0 b   resource:///org/gnome/shell/ui/extensionSystem.js:196 (d4e5c9139c0 @ 813)
#7   5555569a0018 i   resource:///org/gnome/shell/ui/extensionSystem.js:398 (d4e5c913e20 @ 450)
#8   55555699ff78 i   self-hosted:1429 (113a3aabf6a0 @ 30)
#9   7fffffffce00 b   self-hosted:632 (1e5cbbbf2420 @ 15)
```


[console-standard]: https://console.spec.whatwg.org/
[console-docs]: https://gjs-docs.gnome.org/gjs/console.md
[console-log]: https://gjs-docs.gnome.org/gjs/console.md#console-log
[logging-docs]: https://gjs-docs.gnome.org/gjs/logging.md
[logging-log]: https://gjs-docs.gnome.org/gjs/logging.md#log
[logging-logerror]: https://gjs-docs.gnome.org/gjs/logging.md#logerror
[system-breakpoint]: https://gjs-docs.gnome.org/gjs/system.md#breakpoint
