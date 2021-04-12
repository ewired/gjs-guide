---
title: Tips On Memory Management
---

# Tips On Memory Management

GJS is JavaScript bindings for GNOME, which means that behind the scenes there are two types of memory management happening: reference tracing (JavaScript) and reference counting (GObject).

Most developers will never have to worry about GObject referencing or memory leaks, especially if writing clean, uncomplicated code. This page describes some common ways developers fail to take scope into account or cleanup main loop sources and signal connections.


## Basics

The concept of reference counting is very simple. When a `GObject` is first created, it has a reference count of `1`. When the reference count drops to `0`, all the object's resources and memory are automatically freed.

The concept of reference tracing is also quite simple, but can get confusing because it relies on external factors. When a value or object is no longer assigned to any variable, it will be garbage collected. In other words, if the JavaScript engine can not "trace" a value back to a variable it will free that value.

Put simply, as long as GJS can trace a `GObject` to a variable, it will ensure the reference count does not drop to `0`.


### Relevant Reading

If you are very new to programming, you should familiarize yourself with the concept of **scope** and the three types of variables in JavaScript: `const`, `let` and `var`. A basic understanding of these will help you a lot while trying to ensure the garbage collector can do its job.

You should also consider enabling **strict mode** in all your scripts, as this will prevent some mistakes that lead to uncollectable objects.

 * [`const`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const), [`let`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let), [`var`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/var)
 * [Variable Scope](https://developer.mozilla.org/docs/Glossary/Scope)
 * [Strict mode](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode)


### Examples

Below we create an `StLabel` and assign to the variable `myLabel`. By assigning it to a variable we are "tracing" a reference to it, preventing the JS Object from being garbage collected and the GObject from being freed:

```js
const St = imports.gi.St;

let myLabel = new St.Label({
    text: 'Some Text',
});
```


Because `let` has block scope, `myLabel` would stop being traced when the scope is left. If the `GObject` is not assigned to a variable in a parent scope, it will be collected and freed.

```js
const St = imports.gi.St;

// This variable is in the top-level scope, effectively making it a global
// variable. It will trace whatever value is assigned to it, until it is set to
// another value or the script exits
let myLabel;

if (true) {
    // This variable is only valid inside this `if` construct
    let myLabelScoped = new St.Label({
        text: 'Some Text',
    });

    // After assigning `myLabelScoped` to `myLabel` the GObject is being
    // traced from two variables, preventing it from being collected or freed
    myLabel = myLabelScoped;
}

// The GObject is no longer being traced from `myLabelScoped`, but it is being
// traced from `myLabel` so it will not be collected.
log(myLabel.text);

// After we set `myLabel` to `null`, it will no longer be traceable from any
// variable, thus it will be collected and the GObject freed.
myLabel = null;
```


Other GObjects can hold a reference to GObjects, such as a container object. This means that even if it can not be traced from a JavaScript variable, it will have a positive reference count and not be freed.

```js
'use strict';

const St = imports.gi.St;


let myLabel = new St.Label({
    text: 'Some Text',
});

// Once we add `myLabel` to `myBox`, the GObject's reference count will increase
// and prevent it from being freed, even if it can not longer be traced from a
// JavaScript variable
let myBox = new St.BoxLayout();
myBox.add_child(myLabel);

// We can now safely stop tracing the GObject from `myLabel` by setting it to
// another value.
//
// It is NOT necessary to do this in most cases, as the variable will stop
// tracing the GObject when it falls out of scope.
myLabel = null;
```


However, if the only thing preventing a GObject from being collected is another GObject holding a reference, once it drops that reference it will be freed.

```js
'use strict';

const St = imports.gi.St;

let myBox = new St.BoxLayout();

if (true) {
    let myLabel = new St.Label({
        text: 'Some Text',
    });

    myBox.add_child(myLabel);
}

// Even though it has not been explicitly destroyed with a function like
// Clutter.Actor.destroy(), the reference count of the StLabel will drop to 0
// and the GObject will be freed
myBox.remove_all_children();
```


## Use After Free

Most functions that affect memory management are not available in GJS, but there are some exceptions. Functions like `Gtk.Widget.destroy()` and `Clutter.Actor.destroy()` are common functions you may use, which will force the `GObject` to be freed as though its reference count had dropped to `0`. What it won't do is stop a JS variable from tracing that GObject.

Attempting to access a GObject after it has been finalized (freed) is a programmer's error that is not uncommon to see in extensions. Trying to use such an object will raise a critical error and print a stack trace to the log. Below is an simple example of how you can continue to trace a reference to a GObject that has already been freed:

```js
'use strict';

const St = imports.gi.St;


let myLabel = new St.Label({
    text: 'Some Text',
});

// Here we are FORCING the GObject to be freed, as though it's reference count
// had dropped to 0.
myLabel.destroy();

// Even though this GObject is being traced from `myLabel`, trying to call
// its methods or access its properties will raise a critical error because all
// it's resources have been freed.
log(myLabel.text);

// In this case we are in the top-level scope, so the proper thing to do is
// `null` the variable to allow garbage collector to free the JS wrapper.
myLabel = null;
```

## Leaking References

Although memory is managed for you by GJS, remember that this is done by tracing to variables. If you lose track of a variable, the ID for a signal or source callback you will leak that reference.

### Scope

The easiest way to leak references is to overwrite a variable or let it fall out of scope. If this variable points to a GObject with a positive reference count that you are responsible for freeing, you will effectively leak its memory.

In this example we leak our references when `enable()` returns. Because we no longer have a direct reference to `indicator` or the ID of it in the status area, we have lost our ability to destroy `indicator` when `disable()` is called.

```js
'use strict';

const {GLib} = imports.gi;
const Main = imports.ui.Main;
const PanelMenu = imports.ui.panelMenu;


function enable() {
    let indicator = new PanelMenu.Button(0.0, 'MyIndicator', false);
    let randomId = GLib.uuid_string_random();

    Main.panel.addToStatusArea(randomId, indicator);
}

function disable() {
    // When `enable()` returned, both `indicator` and `randomId` fell out of
    // scope and got collected. However, the panel status area is still holding
    // a reference to the PanelMenu.Button GObject.
    //
    // Each time the extension is disabled/enabled (eg. screen locks/unlocks)
    // a new, unremovable indicator will be added to the panel
}
```

Although the principle of the code below is sound, we are leaking a reference to a GObject we are responsible for (and thus memory). The leak below is fairly easy to spot; what's important is how and why that reference was leaked. Mistakes like these are often easier to make and harder to track down.

```js
'use strict';

const {GLib} = imports.gi;
const Main = imports.ui.Main;
const PanelMenu = imports.ui.panelMenu;


let indicators = {};


function enable() {
    let indicator1 = new PanelMenu.Button(0.0, 'MyIndicator1', false);
    let indicator2 = new PanelMenu.Button(0.0, 'MyIndicator2', false);

    Main.panel.addToStatusArea(GLib.uuid_string_random(), indicator1);
    Main.panel.addToStatusArea(GLib.uuid_string_random(), indicator2);

    indicators['MyIndicator1'] = indicator1;
    indicators['MyIndicator1'] = indicator2;
}

function disable() {
    for (let [name, indicator] of Object.entries(indicators))
        indicator.destroy();

    indicators = {};
}
```

### Main Loop Sources

A very common way of leaking GSource's is recursive (repeating) sources added to the GLib event loop. These are usually repeating timeout loops, used to update something in the UI.

In the example [GNOME Shell Extension](https://gjs.guide/extensions/) below, the ID required to remove the `GSource` from the main loop has been lost and the callback will continue to be invoked even after the object has been destroyed.

So in this case, the leak is caused by the main loop holding a reference to the `GSource`, while the programmer has lost their ability to remove it. When the source callback is invoked, it will try to access the object after it has been destroyed, causing a critical error.


```js
'use strict';

const {GLib, GObject} = imports.gi;
const PanelMenu = imports.ui.panelMenu;


var MyIndicator = GObject.registerClass({
    GTypeName: 'MyIndicator',
}, class MyIndicator extends PanelMenu.Button {

    startUpdating() {
        // When `startUpdating()` returns, we will lose our reference to
        // `sourceId`, so we will be unable to remove it from the the main loop
        let sourceId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            5,
            this.update.bind(this)
        );
    }

    update() {
        // If the object has been destroyed, this will cause a critical error.
        // Note that the use of Function.bind() is what allows `this` to be
        // traced to the JavaScript object.
        this.visible = this.visible;

        // Returning `true` or `GLib.SOURCE_CONTINUE` causes the GSource to
        // persist, so the callback will run when the next timeout is reached
        return GLib.SOURCE_CONTINUE;
    }

    _onDestroy() {
        // We don't have a reference to `sourceId` so we can't remove the
        // source from the loop. We should have assigned the source ID to an
        // object property in `_init()` like `this._timeoutId`

        super._onDestroy();
    }
});

let indicator = null;

function enable() {
    indicator = new MyIndicator();

    // Each time the extension is enabled, a new GSource will added to the main
    // main loop by this function
    indicator.startUpdating();
}

function disable() {
    indicator.destroy();
    indicator = null;

    // Even though we have destroyed the GObject and stopped tracing it from the
    // `indicator` variable, the GSource callback will continue to be invoked
    // every 5 seconds.
}
```

### Signal Callbacks

Like main loop sources, whenever a signal is connected it returns a handler ID. Failing to remove sources or disconnect signals can result in "use-after-free" scenarios, but it's also possible to trace variables and leak references in a callback.

In the example below, the callback for the `changed::licensed` signal is tracing the `agent` dictionary, which is why the callback continues to work after `constructor()` returns. In fact, even after we set `myObject` to `null` in `disable()`, the dictionary is still be traced from within the signal callback.

```js
'use strict';

const ExtensionUtils = imports.misc.extensionUtils;


let settings = ExtensionUtils.getSettings();
let myObject;

class MyObject {
    constructor() {
        let agent = {
            'family': 'Bond',
            'given': 'James',
            'codename': '007',
            'licensed': true
        };

        // Here is where we should have retained the handler ID
        let id = settings.connect('changed::licensed', (settings, key) => {

            // Here we are tracing a reference to the `agent` dictionary. Since
            // the signal handler ID is leaked, it is never disconnected and the
            // `agent` dictionary is leaked
            agent.licensed = settings.get_boolean(key);
        });
    }
}

function enable() {
    myObject = new MyObject();
}

function disable() {
    myObject.destroy();
    myObject = null;
}
```


## Cairo

Cairo is an exception in GJS, in that it is necessary to manually free the memory of a `CairoContext` at the end of a drawing method. This is simple to do, but forgetting to do it can leak a lot of memory because widgets can be redrawn quite often.

```js
'use strict';

const {GLib, GObject, St} = imports.gi;


let area = new St.DrawingArea({
    width: 32,
    height: 32
});

area.connect('repaint', (area) => {
    // Get the cairo context
    let cr = area.get_context();

    // Do some drawing with cairo

    // Explicitly tell Cairo to free the context memory
    cr.$dispose();
});
```

