const {GLib, Gio} = imports.gi;


const file = Gio.File.new_for_path('test-file.txt');

const fileInfo = await file.query_info_async('standard::*,unix::uid',
    Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT, null);

// Attributes in the `standard` namespace
const fileName = fileInfo.get_name();
const fileSize = fileInfo.get_size();

// Attributes in other namespaces
const unixMode = fileInfo.get_attribute_uint32('unix::uid');
