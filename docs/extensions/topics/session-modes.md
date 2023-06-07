---
title: Session Modes
---

# Session Modes

Session modes are environment states of GNOME Shell. For example, when a user is
logged in and using their desktop the Shell is in the `user` mode.

Since GNOME 42, extensions have the option of operating in other session modes,
such as the `unlock-dialog` mode when the screen is locked. For more details,
see the [`session-modes`](/extensions/overview/anatomy.html#session-modes)
documentation.


## Example Usage

Here is an example of a `metadata.json` for an extension that can run in the
regular `user` mode and continue running in the `unlock-dialog` mode, when the
screen is locked. Pay attention that the shell may use custom user modes that
are not named `user`, so we need to ensure this by also checking the parent mode.

@[code json](@src/extensions/topics/session-modes/metadata.json)

Like standard extensions, the extension will be enabled when the user logs in
and logs out, but won't be disabled when the screen locks.

Extensions that continue running on the lock screen will usually want to disable
UI elements when the session is locked, while continuing to operate in the
background.

@[code js](@src/extensions/topics/session-modes/extension.js)
