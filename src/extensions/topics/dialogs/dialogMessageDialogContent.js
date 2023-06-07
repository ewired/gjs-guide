const { St } = imports.gi;

const Dialog = imports.ui.dialog;


// Creating a dialog layout
const parentActor = new St.Widget();
const dialogLayout = new Dialog.Dialog(parentActor, 'my-dialog');

// Adding a widget to the content area
const messageLayout = new Dialog.MessageDialogContent({
    title: 'Important',
    description: 'Something happened that you should know about!',
});
dialogLayout.contentLayout.add_child(messageLayout);

// Adding a default button
dialogLayout.addButton({
    label: 'Close',
    isDefault: true,
    action: () => {
        dialogLayout.destroy();
    },
});
