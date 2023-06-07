const ExtensionUtils = imports.misc.extensionUtils;


class Extension {
    constructor() {
        // DO NOT create objects, connect signals or add main loop sources here
    }

    enable() {
        // Create objects, connect signals, create timeout sources, etc.
    }

    disable() {
        // Destroy objects, disconnect signals, remove timeout sources, etc.
    }
}

function init() {
    // Initialize translations before returning the extension object
    ExtensionUtils.initTranslations();

    return new Extension();
}
