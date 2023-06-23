const {GLib, GObject, Gio} = imports.gi;


const SomeObject = GObject.registerClass({
    Properties: {
        'example-property': GObject.ParamSpec.string(
            'example-property',
            'Example Property',
            'A read-write string property',
            GObject.ParamFlags.READWRITE,
            null
        ),
    },
}, class SomeObject extends GObject.Object {
});


const someInstance = new SomeObject({
    example_property: 'initial value',
});

someInstance.connect('notify::example-property', (object) => {
    console.log(`GObject Property: ${object.example_property}`);
});


const propertyAction = new Gio.PropertyAction({
    name: 'example',
    object: someInstance,
    property_name: 'example-property',
});

propertyAction.connect('notify::state', (action) => {
    console.log(`Action State: ${action.state.unpack()}`);
});


someInstance.example_property = 'new value';
propertyAction.change_state(GLib.Variant.new_string('newer value'));
