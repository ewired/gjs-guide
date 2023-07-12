---
title: Notifications
---

# Notifications

GNOME Shell provides implementations for [freedesktop.org Notifications][fdo]
and [GTK Notifications][gtk], serving as the notification server. These
different implementations are usually hidden from application developers, who
use the [`Gio.Notification`][gnotification] abstraction to send notifications.

The GNOME Shell process itself is not a `Gio.Application`, and uses its own
internal methods for showing notifications, bypassing the notification server.
Extensions may also use these methods for displaying notifications.

[fdo]: https://specifications.freedesktop.org/notification-spec/notification-spec-latest.html
[gtk]: https://developer.gnome.org/documentation/tutorials/notifications.html
[gnotification]: https://gjs-docs.gnome.org/gio20/gio.notification


## Simple Notifications

Extensions that want to display a simple notification to the user, may use the
method `Main.notify()`.

@[code js](@src/extensions/topics/notifications/mainNotify.js)

If the notification is communicating an error to the user, the
`Main.notifyError()` method will also log the notification as a warning.

@[code js](@src/extensions/topics/notifications/mainNotifyError.js)

The logged warning will appear similar to this:

```sh
GNOME Shell-Message: 00:00:00.000: error: Failed to load configuration: File not found
```
