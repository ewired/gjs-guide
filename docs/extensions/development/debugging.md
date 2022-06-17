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

GJS has a number of built in logging functions, although not all of them are useful for extensions.

```js
// Log a string, usually to `journalctl`
log('a message');

// Log an Error() with a stack trace and optional prefix
try {
    throw new Error('An error occurred');
} catch (e) {
    logError(e, 'ExtensionError');
}

// Print a message to stdout
print('a message');

// Print a message to stderr
printerr('An error occured');
```

When writing extensions, `print()` and `printerr()` are not particularly useful since we won't have easy access to `gnome-shell`'s `stdin` and `stderr` pipes. Instead you will want use `log()` and `logError()` and watch the log in a new terminal with `journalctl`:

```sh
$ journalctl -f -o cat /usr/bin/gnome-shell
```

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

## Recovering from Fatal Errors

Despite the fact that extensions are written in JavaScript, the code is executed in the same process as `gnome-shell` so fatal programmer errors can crash GNOME Shell in a few situations. If your extension crashes GNOME Shell as a result of the `init()` or `enable()` hooks being called, this can leave you unable to log into GNOME Shell.

If you find yourself in this situation, you may be able to correct the problem from a TTY:

 1. **Switch to a free TTY and log in**

    You can do so, for example, by pressing `Ctrl` + `Alt` + `F4`. You may have to cycle through the `F#` keys.

 2. **Start `journalctl` as above**

    ```sh
    $ journalctl -f -o cat /usr/bin/gnome-shell
    ```

 3. **Switch back to GDM and log in**

    After your log in fails, switch back to the TTY running `journalctl` and see if you can determine the problem in your code. If you can, you may be able to correct the problem using `nano` or `vim` from the command-line.

If you fail to diagnose the problem, or you find it easier to review your code in a GUI editor, you can simply move your extension directory up one directory. This will prevent your extension from being loaded, without losing any of your code:

```sh
$ mv ~/.local/share/gnome-shell/extensions/example@shell.gnome.org ~/.local/share/gnome-shell/
```

