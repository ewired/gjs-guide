const {Gio, GLib} = imports.gi;


const source = Gio.File.new_for_path('test-file.txt');
const target = Gio.File.new_for_path('test-move.txt');

await source.move_async(target, Gio.FileCopyFlags.NONE, GLib.PRIORITY_DEFAULT,
    null);
