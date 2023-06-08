---
title: Debugging
---

# Debugging

While debugging is always an important part of programming, it can be a little more difficult with GNOME Shell extensions because of how they integrate into an existing process. 

## Reloading Extensions

As a technical limitation of JavaScript engines, extensions can not be unloaded from a running instance of GNOME Shell. This can make testing incremental changes tedious.

### Running a Nested GNOME Shell

The most convenient way to test incremental changes, especially for Wayland users, is by running a nested instance of GNOME Shell. Running the following command from a terminal will start a new `gnome-shell` process, with its own D-Bus session:

```sh
dbus-run-session -- gnome-shell --nested --wayland
```

Any errors, warnings or debug messages will be logged in the terminal, which also makes it much easier to fix problems that occur when the extension is loaded.

Note that a nested GNOME Shell is not completely isolated, so you may encounter some problems depending on how the extension interacts with the desktop. Most extensions should work exactly as they do in a standard session, though.

### Restarting GNOME Shell

In an X11 session, GNOME Shell can be completely restarted by pressing `Alt`+`F2` to open the *Run a Command* dialog, then running the built-in command `restart`. Wayland sessions do not support the `restart` command, so you must log out and log in to restart GNOME Shell.

## Logging

::: tip
Some distributions may require you to be part of a `systemd` user group to access logs. On systems that are not using `systemd`, logs may be written to `~/.xsession-errors`.
:::

GJS has a number of logging facilities, some particular to GJS, others inherited from JavaScript and a few that are provided by GLib. There is more complete documentation available for [Built-in Logging][logging-docs] and the [`console`][console-docs] suite of functions.

GNOME Shell extensions have a special feature available that can be used with `journald`. By passing an extension's UUID with the `GNOME_SHELL_EXTENSION_UUID` variable, you can filter out all messages except those that your extension logs:

```sh
$ journalctl -f -o cat GNOME_SHELL_EXTENSION_UUID=example@shell.gnome.org
```

Note that the `console` functions do not work with the `GNOME_SHELL_EXTENSION_UUID` feature, so if you rely on this you should use the built-in functions instead. This will also filter out messages from the `gnome-shell` process itself, which may mean you miss errors and warnings still relevant to your extension.

## GJS Console

Similar to Python, GJS also has a console you can use to test things out. However, you will not be able to access live code running in the `gnome-shell` process or import JS modules from GNOME Shell, since this a separate process.

```sh
$ gjs-console
gjs> log('a message');
Gjs-Message: 06:46:03.487: JS LOG: a message

gjs> try {
....     throw new Error('An error occurred');
.... } catch (e) {
....     logError(e, 'ConsoleError');
.... }

(gjs-console:9133): Gjs-WARNING **: 06:47:06.311: JS ERROR: ConsoleError: Error: An error occurred
@typein:2:16
@<stdin>:1:34
```


[console-standard]: https://console.spec.whatwg.org/
[console-docs]: https://gjs-docs.gnome.org/gjs/console.md
[logging-docs]: https://gjs-docs.gnome.org/gjs/logging.md
