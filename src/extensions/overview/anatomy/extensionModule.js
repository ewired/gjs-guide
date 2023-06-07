const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init(meta) {
    console.debug(`initializing ${meta.metadata.name}`);
}


function enable() {
    console.debug(`enabling ${Me.metadata.name}`);
}


function disable() {
    console.debug(`disabling ${Me.metadata.name}`);
}
