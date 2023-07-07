const {GLib, Gio} = imports.gi;


const file = Gio.File.new_for_path('test-file.txt');

const outputStream = await file.create_async(Gio.FileCreateFlags.NONE,
    GLib.PRIORITY_DEFAULT, null);
