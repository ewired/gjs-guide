const {GLib, Gio} = imports.gi;


const file = Gio.File.new_for_path('test-file.txt');

const bytes = new GLib.Bytes('some file contents');
const [etag] = await file.replace_contents_bytes_async(bytes, null, false,
    Gio.FileCreateFlags.REPLACE_DESTINATION, null);
