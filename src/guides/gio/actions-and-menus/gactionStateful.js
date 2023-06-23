const { GLib, Gio } = imports.gi;


/*
 * The value type of a stateful action is set at construction from the initial
 * value, and can't be changed afterwards.
 */
const stateAction = new Gio.SimpleAction({
    name: 'stateAction',
    state: GLib.Variant.new_int32(-1),
    state_hint: new GLib.Variant('(ii)', [-1, GLib.MAXINT32]),
});

/*
 * The state will only change once the handler has approved the request.
 */
stateAction.connect('notify::state', (action, pspec) => {
    console.log(`${action.name} state changed: ${action.state.print(true)}`);
});

/*
 * The handler may check for equality, and use the hint to validate the request.
 */
stateAction.connect('change-state', (action, value) => {
    console.log(`${action.name} change request: ${value.print(true)}`);

    if (action.state.equal(value))
        return;

    const [min, max] = action.state_hint.deepUnpack();
    const request = value.unpack();

    if (request >= min && request <= max)
        action.set_state(value);
});
