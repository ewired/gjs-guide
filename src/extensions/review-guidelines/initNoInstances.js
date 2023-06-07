/*
 * This is permitted
 */
const FoobarState = {
    DEFAULT: 0,
    CHANGED: 1,
};

var FoobarBase = class {
    state = FoobarState.DEFAULT;
};

const FoobarTypes = [
    class extends FoobarBase {},
    class extends FoobarBase {},
];

/*
 * This is not permitted
 */
const DEFAULT_FOOBAR = new FoobarBase();


/*
 * Do this instead
 */
var DEFAULT_INSTANCE = null;

function init() {
}

function enable() {
    if (DEFAULT_INSTANCE === null)
        DEFAULT_INSTANCE = new FoobarBase();
}

function disable() {
    if (DEFAULT_INSTANCE instanceof FoobarBase) {
        // Ensure any reference cycles and signals are disconnected as well,
        // before nulling out the variable, to ensure it can be collected.
        DEFAULT_INSTANCE = null;
    }
}
