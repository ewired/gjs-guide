const {GLib, Gio} = imports.gi;


const file = Gio.File.new_for_path('test-file.txt');

const ioStream = await file.open_readwrite_async(GLib.PRIORITY_DEFAULT,
    null);

const inputStream = ioStream.get_input_stream();
const outputStream = ioStream.get_output_stream();
