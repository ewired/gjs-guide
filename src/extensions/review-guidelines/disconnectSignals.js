let handlerId = null;

function init() {
}

function enable() {
    handlerId = global.settings.connect('changed::favorite-apps', () => {
        log('app favorites changed');
    });
}

function disable() {
    if (handlerId) {
        global.settings.disconnect(handlerId);
        handlerId = null;
    }
}

function init() {
}
