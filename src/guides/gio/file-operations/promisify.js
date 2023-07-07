const {Gio} = imports.gi;


/* Gio.File */
Gio._promisify(Gio.File.prototype, 'copy_async',
  'copy_finish');
Gio._promisify(Gio.File.prototype, 'create_async',
  'create_finish');
Gio._promisify(Gio.File.prototype, 'enumerate_children_async',
  'enumerate_children_finish');
Gio._promisify(Gio.File.prototype, 'load_contents_async',
  'load_contents_finish');
Gio._promisify(Gio.File.prototype, 'make_directory_async',
  'make_directory_finish');
Gio._promisify(Gio.File.prototype, 'move_async',
  'move_finish');
Gio._promisify(Gio.File.prototype, 'open_readwrite_async',
  'open_readwrite_finish');
Gio._promisify(Gio.File.prototype, 'query_info_async',
  'query_info_finish');
Gio._promisify(Gio.File.prototype, 'replace_contents_async',
  'replace_contents_finish');
Gio._promisify(Gio.File.prototype, 'replace_contents_bytes_async',
  'replace_contents_finish');
Gio._promisify(Gio.File.prototype, 'trash_async',
  'trash_finish');

/* Gio.FileEnumerator */
Gio._promisify(Gio.FileEnumerator.prototype, 'iter_next_async',
  'iter_next_finish');

/* Gio.InputStream */
Gio._promisify(Gio.InputStream.prototype, 'read_bytes_async',
  'read_bytes_finish');

/* Gio.OutputStream */
Gio._promisify(Gio.OutputStream.prototype, 'write_bytes_async',
  'write_bytes_finish');
