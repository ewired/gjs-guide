const {Gio, GLib} = imports.gi;


const file = Gio.File.new_for_path('test-file.txt');

const inputStream = await file.read_async(GLib.PRIORITY_DEFAULT,
    null);

const contentsBytes = await inputStream.read_bytes_async(4096,
    GLib.PRIORITY_DEFAULT, null);
