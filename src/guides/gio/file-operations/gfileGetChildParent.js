const {Gio, GLib} = imports.gi;


// Our starting point, in the current working directory
const cwd = Gio.File.new_for_path('.');

// A child of the directory
const childFile = cwd.get_child('test-file.txt');

// The parent directory
const parentDir = cwd.get_parent();

// A child of the parent directory
const parentFile = parentDir.get_child('parent-file.txt');
