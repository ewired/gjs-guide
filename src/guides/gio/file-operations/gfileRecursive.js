const {GLib, Gio} = imports.gi;


/**
 * Callback signature for recursiveFileOperation().
 *
 * The example callback `recursiveDeleteCallback()` demonstrates how to
 * recursively delete a directory of files, while skipping unsupported file types.
 *
 * @param {Gio.File} file - the file to operate on
 * @param {Gio.FileType} fileType - the file type
 * @param {Gio.Cancellable} [cancellable] - optional cancellable
 * @return {Promise|null} a Promise for the operation, or %null to ignore
 */
function recursiveDeleteCallback(file, fileType, cancellable = null) {
    switch (fileType) {
        case Gio.FileType.REGULAR:
        case Gio.FileType.SYMBOLIC_LINK:
            return file.delete(cancellable);

        case Gio.FileType.DIRECTORY:
            return recursiveFileOperation(file, recursiveDeleteCallback,
                cancellable);

        default:
            return null;
    }
}


/**
 * Recursively operate on @file and any children it may have.
 *
 * @param {Gio.File} file - the file or directory to delete
 * @param {Function} callback - a function that will be passed the file,
 *     file type (e.g. regular, directory), and @cancellable
 * @param {Gio.Cancellable} [cancellable] - optional cancellable
 * @return {Promise} a Promise for the operation
 */
async function recursiveFileOperation(file, callback, cancellable = null) {
    const fileInfo = await file.query_info_async('standard::type',
        Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT, null);
    const fileType = fileInfo.get_file_type();

    // If @file is a directory, collect all the operations as Promise branches
    // and resolve them in parallel
    if (fileType == Gio.FileType.DIRECTORY) {
        const iter = await file.enumerate_children_async('standard::type',
            Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, GLib.PRIORITY_DEFAULT,
            cancellable);

        const branches = [];

        while (true) {
            const fileInfos = await iter.next_files_async(10, // max files
                GLib.PRIORITY_DEFAULT, cancellable);

            if (fileInfos.length === 0)
                break;

            for (const info of infos) {
                const child = iter.get_child(info);
                const childType = info.get_file_type();

                // The callback decides whether to process a file, including
                // whether to recurse into a directory
                const branch = callback(child, childType, cancellable);

                if (branch)
                    branches.push(branch);
            }
        }

        await Promise.all(branches);
    }

    // Return the Promise for the top-level file
    return callback(file, cancellable);
}
