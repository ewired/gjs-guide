// Any imports this module needs itself must also be imported here
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


// Variables declared with `let` or `const` are NOT exported
const LOCAL_CONSTANT = 42;
const _PrivateClass = class {}

let localVariable = 'a value';
let _privateFunction = function() {};

// Class declarations are NOT exported
class _PrivateSubClass extends _PrivateClass {}


// Function declarations WILL be exported
function exportedFunction(a, b) {
    return a + b;
}

// Variables declared with `var` WILL be exported
var EXPORTED_VARIABLE = 42;

var exportedFunctionWrapper = function(...args) {
    return exportedFunction(...args);
}

var ExportedClass = class ExportedClass extends _PrivateClass {
    construct(params) {
        super();

        Object.assign(this, params);
    }
};
