const {GLib, Gio} = imports.gi;


const file = Gio.File.new_for_path('test-file.txt');

const [, contents, etag] = await file.load_contents_async(null);

// GJS >= 1.70 (GNOME 41)
const decoder = new TextDecoder('utf-8');
const contentsString = decoder.decode(contents);

// GJS < 1.70 (GNOME 40 or older)
const ByteArray = imports.byteArray;
const contentsString = ByteArray.toString(contents);
