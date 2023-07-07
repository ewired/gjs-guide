const {Gio, GLib} = imports.gi;


const directory = Gio.File.new_for_path('.');

const iter = await directory.enumerate_children_async('standard::*',
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT, null);

while (true) {
    const fileInfos = await iter.next_files_async(10, // max results
        GLib.PRIORITY_DEFAULT, null);

    if (fileInfos.length === 0)
        break;

    for (const fileInfo of fileInfos)
        console.debug(fileInfo.get_name());
}
