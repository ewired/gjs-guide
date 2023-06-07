const { GLib, St } = imports.gi;

const Dialog = imports.ui.dialog;
const ModalDialog = imports.ui.modalDialog;


// Creating a modal dialog
let testDialog = new ModalDialog.ModalDialog({
    destroyOnClose: false,
    styleClass: 'my-dialog',
});

let reminderId = null;
let closedId = testDialog.connect('closed', (_dialog) => {
    console.debug('The dialog was dismissed, so set a reminder');

    if (!reminderId) {
        reminderId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60,
            () => {
                testDialog.open(global.get_current_time());

                reminderId = null;
                return GLib.SOURCE_REMOVE;
            });
    }
});

testDialog.connect('destroy', (_actor) => {
    console.debug('The dialog was destroyed, so reset everything');

    if (closedId) {
        testDialog.disconnect(closedId);
        closedId = null;
    }

    if (reminderId) {
        GLib.Source.remove(id);
        reminderId = null;
    }

    testDialog = null;
});


// Adding a widget to the content area
const listLayout = new Dialog.ListSection({
    title: 'Todo List',
});
testDialog.contentLayout.add_child(listLayout);

const taskOne = new Dialog.ListSectionItem({
    icon_actor: new St.Icon({ icon_name: 'dialog-information-symbolic' }),
    title: 'Task One',
    description: 'The first thing I need to do',
});
listLayout.list.add_child(taskOne);

const taskTwo = new Dialog.ListSectionItem({
    icon_actor: new St.Icon({ icon_name: 'dialog-information-symbolic' }),
    title: 'Task Two',
    description: 'The next thing I need to do',
});
listLayout.list.add_child(taskTwo);


// Adding buttons
testDialog.setButtons([
    {
        label: 'Close',
        action: () => testDialog.destroy(),
    },
    {
        label: 'Later',
        isDefault: true,
        action: () => testDialog.close(global.get_current_time()),
    },
]);
