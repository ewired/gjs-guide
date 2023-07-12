const Main = imports.ui.main;


try {
    throw Error('File not found')
} catch (e) {
    Main.notifyError('Failed to load configuration', e.message);
}
