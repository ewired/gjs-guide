const { GLib, Gio } = imports.gi;


/*
 * The most basic action, which works similar to a function with no arguments.
 */
const basicAction = new Gio.SimpleAction({
    name: 'basicAction',
});

basicAction.connect('activate', (action, parameter) => {
    console.log(`${action.name} activated!`);
});

basicAction.activate(null);


/*
 * An action that works similar to a function with a single string argument.
 */
const paramAction = new Gio.SimpleAction({
    name: 'paramAction',
    parameter_type: new GLib.VariantType('s'),
});

paramAction.connect('activate', (action, parameter) => {
    console.log(`${action.name} activated: ${parameter.unpack()}`);
});

paramAction.activate(GLib.Variant.new_string('string'));
