const {GLib, Gio} = imports.gi;


const bytes = new GLib.Bytes('some file content');
const bytesWritten = await outputStream.write_bytes_async(bytes,
    GLib.PRIORITY_DEFAULT, null);
