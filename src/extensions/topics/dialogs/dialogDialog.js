const { St } = imports.gi;

const Dialog = imports.ui.dialog;


// Creating a dialog layout
const parentActor = new St.Widget();
const dialogLayout = new Dialog.Dialog(parentActor, 'my-dialog');

// Adding a widget to the content area
const icon = new St.Icon({ icon_name: 'dialog-information-symbolic' });
dialogLayout.contentLayout.add_child(icon);

// Adding a default button
dialogLayout.addButton({
    label: 'Close',
    isDefault: true,
    action: () => {
        dialogLayout.destroy();
    },
});
