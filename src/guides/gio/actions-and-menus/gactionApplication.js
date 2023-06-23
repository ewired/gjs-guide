const { GLib, Gio } = imports.gi;


const application = Gio.Application.new('guide.gjs.Example',
    Gio.ApplicationFlags.DEFAULT_FLAGS);

application.connect('activate', () => {
    console.log('The application has been activated');
});

application.connect('startup', () => {
    console.log('The application will run until instructed to quit');
    application.hold();
});

application.connect('shutdown', () => {
    console.log('The application is shutting down');
    application.hold();
});


/*
 * If activated elsewhere in the application, the action name will be `app.quit`
 */
const quitAction = new Gio.SimpleAction({
    name: 'quit',
});

quitAction.connect('activate', () => {
    console.log('The application is being instructed to quit');
    application.quit();
});

application.add_action(quitAction);


/*
 * Activate the `quit` action, shortly after the application starts.
 */
GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
    application.activate_action('quit', null);
});


application.run([imports.system.programInvocationName].concat(ARGV));
