---
title: D-Bus
---

# D-Bus

This is a fairly long guide on how to use D-Bus in GJS. It covers most topics,
from low-level usage to high-level conveniences and how to easily use D-Bus in
GTK applications. If you're already familiar with D-Bus or you just want to get
started the quickest way possible, you can jump to the high-level code examples
for [Clients](#high-level-proxies) and [Services](#exporting-interfaces). 

While working with D-Bus you can use [D-Feet][dfeet], [D-Spy][dspy] or the
built-in inspector in [GNOME Builder][gnome-builder] to introspect D-Bus on your
desktop. [The guide for `GLib.Variant` values](/guides/glib/gvariant.html) will
also be useful while learning how to use D-Bus.

[dbus]: https://dbus.freedesktop.org/
[gvariant]: https://gjs-docs.gnome.org/glib20/glib.variant
[dfeet]: https://flathub.org/apps/details/org.gnome.dfeet
[dspy]: https://flathub.org/apps/details/org.gnome.dspy
[gnome-builder]: https://flathub.org/apps/details/org.gnome.Builder


**Related Guides**

* [Asynchronous Programming Guide](/guides/gjs/asynchronous-programming.html)
* [GVariant Guide](/guides/glib/gvariant.html)


## Introduction to D-Bus

[D-Bus][dbus] is a messaging system that can be used to communicate between
processes, enforce single-instance applications, start those services on demand
and more. This section is an overview of D-Bus including the structure of
services, bus types and connections.


### Bus Structure

To get our bearings, let's first take a look at the hierarchy of a common D-Bus
service that most users will have on their desktop. [UPower][upower] is a good
example because it exports an object for the application itself and additional
objects for each power device (eg. laptop battery):

```
org.freedesktop.UPower
    /org/freedesktop/UPower
        org.freedesktop.DBus.Introspectable
        org.freedesktop.DBus.Peer
        org.freedesktop.DBus.Properties
        org.freedesktop.UPower
    /org/freedesktop/UPower/devices/battery_BAT0
        org.freedesktop.DBus.Introspectable
        org.freedesktop.DBus.Peer
        org.freedesktop.DBus.Properties
        org.freedesktop.UPower.Device
```

[upower]: https://upower.freedesktop.org/


#### Names

At the top-level we have the well-known name, `org.freedesktop.UPower`. This is
a "reverse-DNS" style name that should also be the [Application ID][app-id]. The
D-Bus server will resolve this to a unique name like `:1.67`, sometimes referred
to as the name owner. Think of this like a DNS server resolving a web site
address (`www.gnome.org`) to an IP address (`8.43.85.13`).

This facilitates what is known as [D-Bus Activation][dbus-activation] which
allows the D-Bus server to automatically start services when they are accessed
at a well-known name. Once the process starts it will "own the name", and thus
become the name owner.

[app-id]: https://developer.gnome.org/DBusApplicationLaunching/documentation/tutorials/application-id.html
[dbus-activation]: https://developer.gnome.org/DBusApplicationLaunching/documentation/guidelines/maintainer/integrating.html#d-bus-activation


#### Object Paths

At the second level we have two object paths: `/org/freedesktop/UPower`
representing the application and `/org/freedesktop/UPower/devices/battery_BAT0`
representing a laptop battery. These objects aren't really used for anything
themselves, but rather are containers for various interfaces.

Notice the convention of using the well-known name (in the form of a path)
as the base path for objects belonging to the service.


#### Interfaces

At the third level we have interfaces and that's what we're really interested
in. Just like a GObject these can have methods, properties and signals.

Like object paths, the convention is to use the well-known name as the base for
base for the interface name. Each path will also have a set of common
interfaces, those beginning with `org.freedesktop.DBus`, for introspecting
the service and property management.

In D-Bus the method arguments and return values, property values and signal
parameters are all D-Bus Variants. When using the GNOME API these are
[`GLib.Variant`][gvariant] objects, which is covered in the
[GVariant guide](/guides/glib/gvariant.html). Note in particular that D-Bus does
not support maybe types (`m`), which means there is no `null` value.


### Bus Connections

A [`Gio.DBusConnection`][gdbusconnection] is used to communicate with the
services on a bus and an average desktop has two bus types. 

The system bus is used for services that are independent of a user session and
often represent real devices like a laptop battery (UPower) or Bluetooth devices
(bluez). You probably won't be exporting any services on this bus, but you might
be a client to a service.

The session bus is far more common to use and many user applications and desktop
services are exported here. Some examples include notification servers, search
providers for GNOME Shell, or or even regular applications such as the file
browser that want to expose actions like `EmptyTrash()`.

You can get a bus connection using the convenience properties in GJS:

```js
const sessionConnection = Gio.DBus.session;
const systemConnection = Gio.DBus.system;
```

[gdbusconnection]: https://gjs-docs.gnome.org/gio20/gio.dbusconnection


### Interface Definitions

Most projects declare interface definitions in XML, either as files or inline in
the code. In GJS describing interfaces that you export in XML is mandatory. GJS
includes convenience functions for creating client proxies directly from an XML
string, which is covered in the [High-Level Proxies](#high-level-proxies)
section.

The official D-Bus documentation has [API Design Guidelines][dbus-api-design],
so we'll just show a simple example of an XML definition:

```xml
<node>
  <!-- Notice that neither the well-known name or object path are defined -->
  <interface name="guide.gjs.Test">
  
    <!-- A method with no arguments and no return value -->
    <method name="SimpleMethod"/>
    
    <!-- A method with both arguments and a return value -->
    <method name="ComplexMethod">
      <arg type="s" direction="in" name="input"/>
      <arg type="u" direction="out" name="length"/>
    </method>
    
    <!-- A read-only property -->
    <property name="ReadOnlyProperty" type="s" access="read"/>
    
    <!-- A read-write property -->
    <property name="ReadWriteProperty" type="b" access="readwrite"/>
    
    <!-- A signal with two arguments -->
    <signal name="TestSignal">
      <arg name="type" type="s"/>
      <arg name="value" type="b"/>
    </signal>
  </interface>
</node>
```

[dbus-api-design]: https://dbus.freedesktop.org/doc/dbus-api-design.html


## Clients

Clients for D-Bus services are often referred to as proxies, and libraries for
many services like Evolution Data Server are either wrappers or subclasses of
[`Gio.DBusProxy`][gdbusproxy]. To get started using proxies quickly, jump ahead
to [High-Level Proxies](#high-level-proxies) and use the convenience classes
offered by GJS.

It was mentioned earlier that some services support D-Bus Activation which
allows the D-Bus server to start the service process automatically. See the
documentation for [`Gio.BusNameWatcherFlags`][gbusnamewatcherflags],
[`Gio.DBusCallFlags`][gdbuscallflags] and [`Gio.DBusProxyFlags`][gdbusproxyflags]
for more information about this and other flags you can pass on the client side.

[gdbusproxy]: https://gjs-docs.gnome.org/gio20/gio.dbusproxy
[gbusnamewatcherflags]: https://gjs-docs.gnome.org/gio20/gio.buswatcherflags
[gdbuscallflags]: https://gjs-docs.gnome.org/gio20/gio.dbuscallflags
[gdbusproxyflags]: https://gjs-docs.gnome.org/gio20/gio.dbusproxyflags


### Watching a Name

To know when a D-Bus service appears and vanishes from the message bus, you can
watch for the well-known name to become owned by a name owner. Note that you can
still hold a client proxy and be connected to signals while a service is
unavailable though.

```js
const { Gio } = imports.gi;


// These two functions are the callbacks for when either the service appears or
// disappears from the bus. At least one of these two functions will be called
// when you first start watching a name.

// This will be called when a process takes ownership of the name, which is to
// say the service actually become active.
function onNameAppeared(connection, name, name_owner) {
    log(`The well-known name ${name} has been owned by ${name_owner}`);
}

// Likewise, this will be invoked when the process that owned the name releases
// the name.
function onNameVanished(connection, name) {
    log(`The name owner of ${name} has vanished`);
}

// Like signal connections and many other similar APIs, this function returns an
// integer that is later passed to Gio.bus_unwatch_name() to stop watching.
const busWatchId = Gio.bus_watch_name(
    Gio.BusType.SESSION,
    'guide.gjs.Test',
    Gio.BusNameWatcherFlags.NONE,
    onNameAppeared,
    onNameVanished
);

Gio.bus_unwatch_name(busWatchId);
```


### Direct Calls

In this section, we'll see by example that all operations we perform as a client
are actually performed on a bus connection. Whether it's calling methods,
getting and setting property values or connecting to signals, these are all
ultimately being passed through a bus connection.

Although you usually won't need to do this, it is sometimes more convenient if
you only need to perform a single operation. In other cases it may be useful to
work around problems with introspected APIs that use D-Bus since the data
exchanged as `GLib.Variant` objects are fully supported.


#### Method Calls

Below is an example of sending a libnotify notification and getting the
resulting reply ID. In this first example we will demonstrate the following
steps:

1. Packing the method arguments
2. Calling the method
3. Unpacking the method reply
4. Handling D-Bus errors

```js
const { GLib, Gio } = imports.gi;


// All the operations in these examples will be on the sesson bus
const connection = Gio.DBus.session;

/* 1. Packing the method arguments
 *
 *    Note that calling methods directly in this way will require you to find
 *    documentation or introspect the interface. D-Feet and D-Spy can help here.
 */
const notification = new GLib.Variant('(susssasa{sv}i)', [
    'GJS D-Bus Tutorial',
    0,
    'dialog-information-symbolic',
    'Example Title',
    'Example Body',
    [],
    {},
    -1
]);


/* 2. Calling the method
 *
 *    To call a method directly, you will need to know the well-known name,
 *    object path and interface name. You will also need to know whether the
 *    service is on the session bus or the system bus.
 */
connection.call(
    'org.freedesktop.Notifications',
    '/org/freedesktop/Notifications',
    'org.freedesktop.Notifications',
    'Notify',
    notification,
    null,
    Gio.DBusCallFlags.NONE,
    -1,
    null,
    (connection, res) => {
        try {
    
            /* 3. Unpacking the method reply
             *
             *    The reply of a D-Bus method call is always a tuple. If the
             *    method has no return value the tuple will be empty, otherwise
             *    it will be a packed variant.
             */
            const reply = connection.call_finish(res);

            // Our method call has a reply, so we will extract it by getting the
            // fist child of the tuple, which is the actual method return value.
            const value = reply.get_child_value(0);

            // The return type of this method is 32-bit unsigned integer or `u`,
            // although the JavaScript type will be `Number`.
            const id = value.get_uint32();

            // And log the reply
            log(`Notification ID: ${id}`);
        } catch (e) {
        
            /* 4. Handling D-Bus errors
             *
             *    Errors returned by D-Bus may contain extra information we
             *    don't want to present to users. See the documentation for more
             *    information about `Gio.DBusError`.
             */
            if (e instanceof Gio.DBusError)
                Gio.DBusError.strip_remote_error(e);
            
            logError(e);
        }
    }
);
```

#### Properties

Getting or setting the value of properties are also just method calls, just
made to the standard `org.freedesktop.DBus.Properties` interface. The name of
the interface holding the property is passed as the first argument of the method
arguments.

```js
// Getting a property value
connection.call(
    'org.gnome.Shell',
    '/org/gnome/Shell',
    'org.freedesktop.DBus.Properties',
    'Get',
    new GLib.Variant('(ss)', ['org.gnome.Shell', 'ShellVersion']),
    null,
    Gio.DBusCallFlags.NONE,
    -1,
    null,
    (connection, res) => {
        try {
            const reply = connection.call_finish(res);
            const value = reply.deepUnpack()[0];
            const version = value.get_string()[0];

            log(`GNOME Shell Version: ${version}`);
        } catch (e) {
            if (e instanceof Gio.DBusError)
                Gio.DBusError.strip_remote_error(e);
                
            logError(e);
        }
    }
);

// Setting a property value
connection.call(
    'org.gnome.Shell',
    '/org/gnome/Shell',
    'org.freedesktop.DBus.Properties',
    'Set',
    new GLib.Variant('(ssv)', [
        'org.gnome.Shell',
        'OverviewActive',
        GLib.Variant.new_boolean(true)
    ]),
    null,
    Gio.DBusCallFlags.NONE,
    -1,
    null,
    (connection, result) => {
        try {
            connection.call_finish(result);
        } catch (e) {
            if (e instanceof Gio.DBusError)
                Gio.DBusError.strip_remote_error(e);
                
            logError(e);
        }
    }
);
```

#### Signal Connections

Connecting signal handlers directly on a connection is also possible. See the
[`Gio.DBusConnection.signal_subscribe()`][conn-signal-subscribe] documentation
for details about signal matching.

```js
// The callback for a signal connection
function onActiveChanged(connection, sender, path, iface, signal, params) {
    const value = params.get_child_value(0);
    const locked = value.get_boolean();

    log(`Screen Locked: ${locked}`)
}

// Connecting a signal handler returns a handler ID, just like GObject signals
const handlerId = connection.signal_subscribe(
    'org.gnome.ScreenSaver',
    'org.gnome.ScreenSaver',
    'ActiveChanged',
    '/org/gnome/ScreenSaver',
    null,
    Gio.DBusSignalFlags.NONE,
    onActiveChanged
);

// Disconnecting a signal handler
connection.signal_unsubscribe(handlerId);
```

[conn-signal-subscribe]: https://gjs-docs.gnome.org/gio20/gio.dbusconnection#method-signal_subscribe


### Low-Level Proxies

The reason [`Gio.DBusProxy`][gdbusproxy] objects are so much more convenient is
they allow you to treat the collection of methods, properties and signals of a
service interface as a discrete object. They can automatically cache the values
of properties as they change, connect and group signals, watch for the name
owner appearing or vanishing, and generally reduce the amount of code you have
to write.

Note that the synchronous constructors will block the main thread while
getting the D-Bus connection and caching the initial property values. To avoid
this, you can use asynchronous constructors like `Gio.DBusProxy.new()` and
`Gio.DBusProxy.new_for_bus()`.


```js
const { Gio } = imports.gi;


// Constructing a proxy
const proxy = Gio.DBusProxy.new_for_bus_sync(
    Gio.BusType.SESSION,
    Gio.DBusProxyFlags.NONE,
    null,
    'org.gnome.Shell',
    '/org/gnome/Shell',
    'org.gnome.Shell',
    null
);

// This signal is emitted when one or more properties have changed on the proxy,
// similar to the GObject::notify signal.
proxy.connect('g-properties-changed', (proxy, changed, invalidated) => {
    const properties = changed.deepUnpack();

    // These properties will already be cached when the signal is emitted
    for (const [name, value] of Object.entries(properties))
        log(`Property ${name} set to ${value.unpack()}`);
    
    // These properties have been marked as changed, but not cached. A service
    // might do this for performance reasons, but you can override this
    // behaviour with Gio.DBusProxyFlags.GET_INVALIDATED_PROPERTIES in which
    // case this will always be an empty.
    for (const name of invalidated)
        log(`Property ${name} changed`);
});

// This signal is emitted for any other D-Bus signal the interface emits, so you
// can handle them yourself as you see fit
proxy.connect('g-signal', (proxy, sender_name, signal_name, parameters) => {
    if (signal_name === 'AcceleratorActivated')
        log(`Accelerator Activated: ${parameters.print(true)}`);
});

// GDBusProxy has a notified GObject property we can watch to know when a
// service has appeared or vanished from the bus, serving the same purpose as a
// name watcher.
proxy.connect('notify::g-name-owner', (proxy, pspec) => {
    if (proxy.g_name_owner === null)
        log(`${proxy.g_name} has vanished`);
    else
        log(`${proxy.g_name} has appeared`);
});

// The only thing you'll gain for methods is not needing to include the name,
// object path or interface name
proxy.call(
    'FocusSearch',
    null,
    Gio.DBusCallFlags.NO_AUTO_START,
    -1,
    null,
    (proxy, res) => {
        try {
            proxy.call_finish(res);
        } catch (e) {
            logError(e);
        }
    }
);
```

[g-interface-info]: https://gjs-docs.gnome.org/gio20/gio.dbusproxy#property-g_interface_info


### High-Level Proxies

The D-Bus conveniences in GJS are the easiest way to get a client and cover most
use cases. All you need to do is call `Gio.DBusProxy.makeProxyWrapper()` with
the interface XML and it will create a reusable class you can use to create
proxies.


#### Creating a Proxy Wrapper

Below is an example of how a proxy wrapper is created from an XML interface:

```js
const { Gio } = imports.gi;


// We'll use our XML definition from earlier as an example
const ifaceXml = `
<node>
  <interface name="guide.gjs.Test">
    <method name="SimpleMethod"/>
    <method name="ComplexMethod">
      <arg type="s" direction="in" name="input"/>
      <arg type="u" direction="out" name="length"/>
    </method>
    <signal name="TestSignal">
      <arg name="type" type="s"/>
      <arg name="value" type="b"/>
    </signal>
    <property name="ReadOnlyProperty" type="s" access="read"/>
    <property name="ReadWriteProperty" type="b" access="readwrite"/>
  </interface>
</node>`;


// Pass the XML string to create a proxy class for that interface
const TestProxy = Gio.DBusProxy.makeProxyWrapper(ifaceXml);
```

Now that we have create a re-usable class, we can easily create client proxies
for an interface. The proxy will be created synchronously or asynchronously
depending on whether a callback is passed in the constructor arguments.

The arguments for the constructor are as follows:

* `bus` - a `Gio.DBusConnection`
* `name` - a well-known name
* `object` - an object path
* `asyncCallback` - an optional callback
* `cancellable` - an optional `Gio.Cancellable`
* `flags` - an optional `Gio.DBusProxyFlags` value

The arguments passed to the `asyncCallback` are as follows:

* `proxy` - a `Gio.DBusProxy`, or `null` on failure
* `error` - a `GLib.Error`, or `null` on success


Here are examples for both synchronous and asynchronous construction:

```js
// Synchronous, blocking method
const proxy = TextProxy(Gio.DBus.session, 'guide.gjs.Test', '/guide/gjs/Test');

// Asynchronous, non-blocking method (Promise-wrapped)
function createTestProxyAsync(cancellable = null, flags = Gio.DBusProxyFlags.NONE) {
    return new Promise((resolve, reject) => {
        TestProxy(
            Gio.DBus.session,
            'guide.gjs.Test',
            '/guide/gjs/Test'
            (proxy, error) => {
                if (error === null)
                    resolve(proxy);
                else
                    reject(error);
            },
            cancellable,
            flags
        );
    });
}
```


#### Using a Proxy Wrapper

With our proxy wrapper class, we can create a `Gio.DBusProxy` that has methods,
properties and signals all set up for us. Below are some examples of how to use
a proxy created from a wrapper:

```js
const { Gio } = imports.gi;

// Create a proxy synchronously, making sure to catch errors
let proxy = null;

try {
    proxy = TestProxy(Gio.DBus.session, 'guide.gjs.Test', '/guide/gjs/Test');
} catch (e) {
    logError(e, 'Constructing proxy');
}


// Properties work just like regular JavaScript properties:
log(`ReadOnlyProperty: ${proxy.ReadOnlyProperty}`);
log(`ReadWriteProperty: ${proxy.ReadWriteProperty}`);

proxy.ReadWriteProperty = true;
log(`ReadWriteProperty: ${proxy.ReadWriteProperty}`);

// However, you will still have to watch Gio.DBusProxy::g-properties-changed to
// be notified of changes
proxy.connect('g-properties-changed', (proxy, changed, invalidated) => {
});


// The wrapper function will assign both synchronous and asynchronous variants
// of methods on the object
proxy.SimpleMethodSync();

proxy.ComplexMethodRemote('input string', (returnValue, errorObj, fdList) => {
    
    // If @errorObj is `null`, then the method call succeeded and the variant
    // will already be unpacked with `GLib.Variant.prototype.deepUnpack()`
    if (errorObj === null) {
        log(`ComplexMethod('input string'): ${returnValue}`);
        
        // Methods that return file descriptors are fairly rare, so you will
        // know if you should expect one or not. Consult the API documentation
        // for `Gio.UnixFDList` for more information.
        if (fdList !== null) {
        }
        
        // If you were wrapping this function call in a Promise, this is where
        // you would call `resolve()`
    
    // If there was an error, then @returnValue will be an empty list and
    // @errorObj will be an Error object
    } else {
        logError(errorObj);
        
        // If you were wrapping this function call in a Promise, this is where
        // you would call `reject()`
    }
});


// Signals are connected and disconnected with the functions `connectSignal()`
// and `disconnectSignal()`, so they don't conflict with the GObject methods.
const handlerId = proxy.connectSignal('TestSignal', (proxy, nameOwner, args) => {
    log(`TestSignal: ${args[0]}, ${args[1]}`);

    proxy.disconnectSignal(handlerId);
};
```


## Services

There are a number of reasons why exporting services over D-Bus can be useful
for an application developer. It can help you establish a client-server
architecture to separate the backend from the front-end, but it can also provide
a language agnostic entry point for your application.


### Owning a Name

The first thing we're going to cover is how to acquire a well-known name on a
on a bus connection and at what point you will want to actually export your
service. This is similar to watching a name:

```js
const { Gio } = imports.gi;


// These three functions are the callbacks to `Gio.bus_own_name()`:

// If there is a client waiting for the well-known name to appear on the bus,
// you probably want to export your interfaces here. This way the interfaces are
// ready to be used when the client is notified the name has been owned.
function onBusAcquired(connection, name) {
    log(`${name}: connection acquired`);
}

// On the other hand, if you were using something like GDBusObjectManager to
// watch for interfaces, you could export your interfaces here.
function onNameAcquired(connection, name) {
    log(`${name}: name acquired`);
}

// Typically you won't see this callback invoked, but it might happen if you try
// to own a name that was already owned by someone else.
function onNameLost(connection, name) {
    log(`${name}: name lost`);
}

// Just like a signal handler ID, the `Gio.bus_own_name()` function returns a
// unique ID we can use to unown the name when we're done with it.
const ownerId = Gio.bus_own_name(
    Gio.BusType.SESSION,
    'guide.gjs.Test',
    Gio.BusNameOwnerFlags.NONE,
    onBusAcquired,
    onNameAcquired,
    onNameLost
);

// Note that `onNameLost()` is NOT invoked when manually unowning a name.
Gio.bus_unown_name(ownerId);
```


### Exporting Interfaces

Now that we know how to own a well-known name, let's get to exporting our
service interface:

```js
const { Gio } = imports.gi;


// We'll use our XML definition from earlier as an example
const ifaceXml = `
<node>
  <interface name="guide.gjs.Test">
    <method name="SimpleMethod"/>
    <method name="ComplexMethod">
      <arg type="s" direction="in" name="input"/>
      <arg type="u" direction="out" name="length"/>
    </method>
    <signal name="TestSignal">
      <arg name="type" type="s"/>
      <arg name="value" type="b"/>
    </signal>
    <property name="ReadOnlyProperty" type="s" access="read"/>
    <property name="ReadWriteProperty" type="b" access="readwrite"/>
  </interface>
</node>`;

class Service {
    constructor() {
    }

    // Properties
    get ReadOnlyProperty() {
        return 'a string';
    }

    get ReadWriteProperty() {
        if (this._readWriteProperty === undefined)
            return false;

        return this._readWriteProperty;
    }

    set ReadWriteProperty(value) {
        this._readWriteProperty = value;
    }

    // Methods
    SimpleMethod() {
        log('SimpleMethod() invoked');
    }

    ComplexMethod(input) {
        log(`ComplexMethod() invoked with '${input}'`);

        return input.length;
    }
}

// Note that when using the D-Bus conveniences in GJS, our JavaScript
// implementation instance is separate from the GObject interface instance.
let serviceImplementation = null;
let serviceInterface = null;

function onBusAcquired(connection, name) {
    serviceImplementation = new Service();
    serviceInterface = Gio.DBusExportedObject.wrapJSObject(ifaceXml,
        serviceImplementation);
    serviceInterface.export(connection, '/guide/gjs/Test');
}

function onNameAcquired(connection, name) {
    // Clients will typically start connecting and using your interface now.
}

function onNameLost(connection, name) {
    // Well behaved clients will know not to call methods on your interface now
}

const ownerId = Gio.bus_own_name(
    Gio.BusType.SESSION,
    'guide.gjs.Test',
    Gio.BusNameOwnerFlags.NONE,
    onBusAcquired.bind(serviceImpl),
    onNameAcquired,
    onNameLost
);
```


## Other APIs

There are a number of APIs in the GNOME platform that can make use of D-Bus,
notably `Gio.Application`, `Gio.Action` and `Gio.Menu`. Although a little less
flexible, these higher-level APIs make exporting functionality on D-Bus
extremely easy and the built-in support in GTK makes them an excellent choice
for applications.

In this section we'll cover the basics of `Gio.Action` and `Gio.Menu`, which
provide an easy way to export functionality and structured presentation. The
GNOME Developer Documentation for [`GActions`][gaction-tutorial] and
[`GMenus`][gmenu-tutorial] have a more complete overview of these APIs.

[gaction-tutorial]: https://developer.gnome.org/documentation/tutorials/actions.html
[gmenu-tutorial]: https://developer.gnome.org/documentation/tutorials/menus.html


### GAction

[`Gio.Action`][gaction] is actually a GObject Interface that can be implemented
by objects, but you will almost always use the provided implementation
[`Gio.SimpleAction`][gsimpleaction]. There are basically two kinds of actions: a
functional type that emits a signal when activated and stateful actions that
hold some kind of value.

`Gio.Action` objects are usually added to objects that implement the 
[`Gio.ActionGroup`][gactiongroup] and [`Gio.ActionMap`][gactionmap] interfaces.
The [`Gio.SimpleActionGroup`][gsimpleactiongroup] implementation provided
supports both of these.

Below are a few examples of how to create each type of action:

```js
const { GLib, Gio } = imports.gi;


// This is the most basic an action can be. It has a name and can be activated
// with no parameters, which results in the callback being invoked.
const basicAction = new Gio.SimpleAction({
    name: 'basicAction'
});

basicAction.connect('activate', (action, parameter) => {
    log(`${action.name} activated!`);
});

// An action with a parameter
const paramAction = new Gio.SimpleAction({
    name: 'paramAction',
    parameter_type: new GLib.VariantType('s')
});

paramAction.connect('activate', (action, parameter) => {
    log(`${action.name} activated: ${parameter.unpack()}`);
});

// And a stateful action. The state type is set at construction from the initial
// value, and can't be changed afterwards.
const stateAction = new Gio.SimpleAction({
    name: 'stateAction',
    state: GLib.Variant.new_boolean(true)
});

stateAction.connect('notify::state', (action, pspec) => {
    log(`${action.name} changed: ${action.state.print(true)}`);
});
```

Once you've created actions, you will want to add them to a group so that they
can be exported over D-Bus. The exported actions will be playing the part of the
"server" in this case.

```js
// Adding actions to an action group
const actionGroup = new Gio.SimpleActionGroup();
actionGroup.add_action(basicAction);
actionGroup.add_action(parameterAction);
actionGroup.add_action(stateAction);


// Exporting action groups on the session bus
const connection = Gio.DBus.session;
const groupId = connection.export_action_group('/guide/gjs/Test',
    actionGroup);
    

// Once exported, action groups can be unexported using the returned ID
connection.unexport_action_group(groupId);
```

Now any number of other processes can act as clients by using a
[`Gio.DBusActionGroup`][gdbusactiongroup]. This class implements the
`Gio.ActionGroup` interface, but not the `Gio.ActionMap` interface. This means
clients can activate actions and change their state value, but they can not
enable, disable, add or remove them.


```js
const Gio = imports.gi.Gio;


// Getting a client for a Gio.ActionGroup is very simple
const remoteGroup = Gio.DBusActionGroup.get(
    Gio.DBus.session,
    'guide.gjs.Test',
    '/guide/gjs/Test'
);

// Watch the group for changes by connecting to the following signals
remoteGroup.connect('action-added', (group, actionName) => {
    log(`${actionName} added!`);
});

remoteGroup.connect('action-removed', (group, actionName) => {
    log(`${actionName} removed!`);
});

remoteGroup.connect('action-enabled-changed', (group, actionName, enabled) => {
    log(`${actionName} is now ${enabled ? 'enabled' : 'disabled'}!`);
});

remoteGroup.connect('action-state-changed', (group, actionName, state) => {
    log(`${actionName} is now has the state ${state.print(true)}!`);
});

// Activating and changing the state of actions.
remoteGroup.activate_action('basicAction', null);
remoteGroup.activate_action('paramAction', new GLib.Variant('s', 'string'));
remoteGroup.change_action_state('stateAction', new GLib.Variant('b', false));
```

What makes `Gio.Action` even more convenient, is that GTK already knows how to
do all of this for you. Simple insert the `Gio.ActionGroup` into any
`Gtk.Widget` and that widget or any of its children that implement the
[`Gtk.Actionable`][gtkactionable] interface can activate or set the state of the
action.

```js
imports.gi.versions.Gtk = '4.0';

const { GLib, Gio, Gtk } = imports.gi;


// Initialize the GTK environment and prepare an event loop
Gtk.init();
const loop = GLib.MainLoop.new(null, false);


// Create a top-level window
const window = new Gtk.Window({
    title: 'GJS GAction Example',
    default_width: 320,
    default_height: 240,
});
window.connect('close-request', () => loop.quit());

const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    margin_start: 12,
    margin_end: 12,
    margin_top: 12,
    margin_bottom: 12,
    spacing: 12,
});
window.set_child(box);


// GTK will search upwards in the hierarchy of widgets for the group, so we will
// insert our action group into the top-level window.
const remoteGroup = Gio.DBusActionGroup.get(
    Gio.DBus.session,
    'guide.gjs.Test',
    '/guide/gjs/Test'
);
window.insert_action_group('test', remoteGroup);


// We can now refer to our actions using the group name chosen when inserting
// it and the action name we want to activate
const button = new Gtk.Button({
    label: 'Click Me!',
    action_name: 'test.paramAction',
    action_target: new GLib.Variant('s', 'Button was clicked!'),
});
box.append(button);

const check = new Gtk.CheckButton({
    label: 'Toggle Me!',
    action_name: 'test.stateAction',
});
box.append(check);


// Open up the window
window.present();
loop.run();
```

[gaction]: https://gjs-docs.gnome.org/gio20/gio.action
[gactiongroup]: https://gjs-docs.gnome.org/gio20/gio.actiongroup
[gactionmap]: https://gjs-docs.gnome.org/gio20/gio.actionmap
[gsimpleaction]: https://gjs-docs.gnome.org/gio20/gio.simpleaction
[gsimpleactiongroup]: https://gjs-docs.gnome.org/gio20/gio.simpleactiongroup
[gdbusactiongroup]: https://gjs-docs.gnome.org/gio20/gio.dbusactiongroup
[gtkactionable]: https://gjs-docs.gnome.org/gtk40/gtk.actionable


### GMenu

[`Gio.MenuModel`][gmenumodel] is another GObject Interface for defining ordered,
nested groups of menu items, sections and submenus. The defacto implementation
of this interface is [`Gio.Menu`][gmenu].

Unlike `Gio.Action`, menu models contain presentation information like labels
and icon names. It's also possible to define menu models in XML UI files, but
we're only going to cover the basic API usage in GJS here because we're really
just covering this for D-Bus usage.

```js
const Gio = imports.gi.Gio;

// Here we're creating the top-level menu. Submenus and sections can be created
// the same way and can be added to a parent menu with `append_submenu()` and
// `append_section()`.
const menuModel = new Gio.Menu();


// For the most common use case you can simply use Gio.Menu.prototype.append()
menuModel.append('Basic Item Label', 'test.basicAction');


// In cases you need the `Gio.MenuItem` instance to add more attributes, you
// can build an item manually. Notice that the second argument is a "detailed"
// action string, which can handle some simple types inline. Consult the
// documentation for how these can be used.
const paramItem = Gio.MenuItem.new('Parameter Item', 'test.paramAction::string');

// Icons are `Gio.Icon` instances, an abtsraction of icons that is serialized as
// a `a{sv}` variant when sent over D-Bus. Note that it's up to the client-side
// to actually do something useful with this.
const paramIcon = new Gio.ThemedIcon({
    name: 'dialog-information-symbolic'
});

paramItem.set_icon(paramIcon);

// Once we add the item to the menu, making changes to the `paramItem` instance
// or the GIcon won't affect the menu in any way.
menuModel.append_item(paramItem);


// A number of the Gtk Widgets that are built from GMenuModels can automatically
// handle simple action types like stateful actions with booleans. This item
// will be turned into a Gtk.CheckButton for us.
const stateItem = Gio.MenuItem.new('State Item', 'test.stateAction');
menuModel.append_item(stateItem);


// Export and unexport a menu just like GActionGroup
const connection = Gio.DBus.session;

const menuId = connection.export_menu_model(
    '/guide/gjs/Test',
    menuModel
);

connection.unexport_menu_model(menuId);
```

Now, assuming we have a remote process exporting both the action group and menu
model from above, we can get clients for both and populate a menu:

```js
imports.gi.versions.Gtk = '4.0';

const { GLib, Gio, Gtk } = imports.gi;


// Initialize the GTK environment and prepare an event loop
Gtk.init();
const loop = GLib.MainLoop.new(null, false);


// Create a top-level window
const window = new Gtk.Window({
    title: 'GJS GMenu Example',
    default_width: 320,
    default_height: 240,
});
window.connect('close-request', () => loop.quit());

const headerBar = new Gtk.HeaderBar({
    show_title_buttons: true,
});
window.set_titlebar(headerBar);


// As before, we'll insert the action group
const remoteGroup = Gio.DBusActionGroup.get(
    Gio.DBus.session,
    'guide.gjs.Test',
    '/guide/gjs/Test'
);
window.insert_action_group('test', remoteGroup);


// Get the remote menu model
const remoteMenu = Gio.DBusMenuModel.get(
    Gio.DBus.session,
    'guide.gjs.Test',
    '/guide/gjs/Test'
);

// And now we'll add a menu button to a header bar with our menu model
const menuButton = new Gtk.MenuButton({
    icon_name: 'open-menu-symbolic',
    menu_model: remoteMenu,
});
headerBar.pack_end(menuButton);


// Show the window and start the event loop
window.present();
loop.run();
```

[gmenu]: https://gjs-docs.gnome.org/gio20/gio.menu
[gmenumodel]: https://gjs-docs.gnome.org/gio20/gio.menumodel
[gdbusmenumodel]: https://gjs-docs.gnome.org/gio20/gio.dbusmenumodel

