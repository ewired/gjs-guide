const {Gio, GLib} = imports.gi;


const source = Gio.File.new_for_path('test-file.txt');
const target = Gio.File.new_for_path('test-copy.txt');

await source.copy_async(target, Gio.FileCopyFlags.NONE, GLib.PRIORITY_DEFAULT,
    // Gio.FileProgressCallback
    (nWritten, nTotal) => {
        const percent = Math.floor(100 * (nWritten / nTotal));
        console.debug(`Progress: ${percent}%`);
    });
