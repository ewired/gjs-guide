// GJS's Built-in Modules are in the top-level of the import object
const Gettext = imports.gettext;
const Cairo = imports.cairo;


// Introspected libraries are under the `gi` namespace
const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;

// Multiple libraries can be imported with object destructuring
const { GLib, GObject, Gio } = imports.gi;
