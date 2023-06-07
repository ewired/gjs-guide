const St = imports.gi.St;

let widget = null;

function init() {
}

function enable() {
    widget = new St.Widget();
}

function disable() {
    if (widget) {
        widget.destroy();
        widget = null;
    }
}
