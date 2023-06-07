class Extension {
    constructor() {
        this._indicator = null;
    }

    enable() {
        this._indicator = new FeatureIndicator();
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}
