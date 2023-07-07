const {GLib, Gio} = imports.gi;


const file = Gio.File.new_for_path('test-directory');

const success = await file.make_directory_async(GLib.PRIORITY_DEFAULT,
    null);
