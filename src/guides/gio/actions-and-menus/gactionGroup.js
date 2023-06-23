const { GLib, Gio } = imports.gi;


/*
 * GSimpleActionGroup implements both GActionGroup and GActionMap
 */
const actionGroup = new Gio.SimpleActionGroup();


/*
 * Using GActionMap, the writable interface for groups of actions.
 *
 * This is an override in GJS, necessary because the standard method is not
 * introspectable.
 */
actionGroup.add_action_entries([
    {
        name: 'basicAction',
        activate: (action, parameter) => {
            console.log(`${action.name} activated!`);
        },
    },
    {
        name: 'paramAction',
        parameter_type: new GLib.VariantType('s'),
        activate: (action, parameter) => {
            console.log(`${action.name} activated: ${parameter.unpack()}`);
        },
    },
    {
        name: 'stateAction',
        state: GLib.Variant.new_boolean(true),
        change_state: (action, value) => {
            console.log(`${action.name} change requested: ${value.print(true)}`);
        },
    },
]);

actionGroup.add_action(new Gio.SimpleAction({
    name: 'removeAction',
    activate: (action, parameter) => {
        console.log(`${action.name} activated!`);
    },
}));

const removeAction = actionGroup.lookup_action('removeAction');

if (removeAction !== null)
    removeAction.enabled = !action.enabled;

actionGroup.remove_action('removeAction');


/*
 * Using GActionGroup, the readable interface for groups of actions.
 *
 * Actions can be queried, activated and state changes requested, but can not be
 * added, removed, enabled or disabled with this interface.
 */
actionGroup.connect('action-added', (action, name) => {
    console.log(`${name} added`);
});
actionGroup.connect('action-enabled-changed', (action, name, enabled) => {
    console.log(`${name} is now ${enabled ? 'enabled' : 'disabled'}`);
});
actionGroup.connect('action-removed', (action, name) => {
    console.log(`${name} removed`);
});
actionGroup.connect('action-state-changed', (action, name, value) => {
    console.log(`${name} state is now ${value.print(true)}`);
});

if (actionGroup.has_action('basicAction'))
    actionGroup.activate_action('basicAction', null);

if (actionGroup.get_action_enabled('paramAction')) {
    actionGroup.activate_action('paramAction', new GLib.Variant('s', 'string'));
    actionGroup.activate_action('paramAction::string', null);
}

const [
    exists,
    enabled,
    parameterType,
    stateType,
    stateHint,
    state,
] = actionGroup.query_action('stateAction');

if (enabled && state.unpack() === true)
    actionGroup.change_action_state('stateAction', GLib.Variant.new_boolean(false));
