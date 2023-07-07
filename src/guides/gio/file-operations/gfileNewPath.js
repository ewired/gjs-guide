const {Gio, GLib} = imports.gi;


// This is a useful method for building file paths from GLib. It will use the
// correct path separator for the current operating system (eg. `/` or `\`)
const filepath = GLib.build_filenamev([GLib.get_home_dir(), 'test-file.txt']);

const file = Gio.File.new_for_path(filepath);
