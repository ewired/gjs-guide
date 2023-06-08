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
controlled by setting enviroment variables used when
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
```


[console-standard]: https://console.spec.whatwg.org/
[console-docs]: https://gjs-docs.gnome.org/gjs/console.md
[console-log]: https://gjs-docs.gnome.org/gjs/console.md#console-log
[logging-docs]: https://gjs-docs.gnome.org/gjs/logging.md
[logging-log]: https://gjs-docs.gnome.org/gjs/logging.md#log
[logging-logerror]: https://gjs-docs.gnome.org/gjs/logging.md#logerror
