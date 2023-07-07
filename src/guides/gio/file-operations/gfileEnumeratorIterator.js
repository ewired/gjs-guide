const {Gio, GLib} = imports.gi;


const directory = Gio.File.new_for_path('.');

const iter = await directory.enumerate_children_async('standard::*',
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT, null);

for await (const fileInfo of iter)
    console.debug(fileInfo.get_name());
