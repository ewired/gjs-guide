const {Gio} = imports.gi;


const file = Gio.File.new_for_path('test-directory');
const child = file.get_child('test-subdirectory');

// NOTE: This is a synchronous, blocking method
child.make_directory_with_parents(null);
