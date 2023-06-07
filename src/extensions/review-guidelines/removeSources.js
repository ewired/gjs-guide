const GLib = imports.gi.GLib;


let sourceId = null;

function init() {
}

function enable() {
    sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
        log('Source triggered');

        return GLib.SOURCE_CONTINUE;
    });
}

function disable() {
    if (sourceId) {
        GLib.Source.remove(sourceId);
        sourceId = null;
    }
}
