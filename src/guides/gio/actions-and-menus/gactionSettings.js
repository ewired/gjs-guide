const {Gio} = imports.gi;


const settings = new Gio.Settings({
    schema_id: 'org.gnome.desktop.interface',
});

settings.connect('changed::enable-animations', (object) => {
    console.log(`GSettings Value: ${object.example_property}`);
});


const settingsAction = settings.create_action('enable-animations');

settingsAction.connect('notify::state', (action) => {
    console.log(`Action State: ${action.state.unpack()}`);
});


settings.set_boolean('enable-animations', false);
settingsAction.activate(null);
