// GNOME Shell imports
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


// You can import your modules using the extension object we imported as `Me`.
const ExampleLib = Me.imports.exampleLib;


let myObject = new ExampleLib.ExportedClass();
ExampleLib.exportedFunction(0, ExampleLib.EXPORTED_VARIABLE);
