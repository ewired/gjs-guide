const {GObject, St} = imports.gi;


// A standard StLabel
let label = new St.Label({
    text: 'LabelText',
    style_class: 'example-style'
});

// An StLabel subclass with `CssName` set to "ExampleLabel"
var ExampleLabel = GObject.registerClass({
    GTypeName: 'ExampleLabel',
    CssName: 'ExampleLabel'
}, class ExampleLabel extends St.Label {
});

let exampleLabel = new ExampleLabel({
    text: 'Label Text'
});
