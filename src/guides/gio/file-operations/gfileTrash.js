const {GLib, Gio} = imports.gi;


const file = Gio.File.new_for_path('test-file.txt');

await file.trash_async(GLib.PRIORITY_DEFAULT, null);
