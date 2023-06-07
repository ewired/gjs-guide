const { St } = imports.gi;

const Dialog = imports.ui.dialog;


// Creating a dialog layout
const parentActor = new St.Widget();
const dialogLayout = new Dialog.Dialog(parentActor, 'my-dialog');

// Adding a widget to the content area
const listLayout = new Dialog.ListSection({
    title: 'Todo List',
});
dialogLayout.contentLayout.add_child(listLayout);

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

// Adding a default button
dialogLayout.addButton({
    label: 'Close',
    action: () => {
        dialogLayout.destroy();
    },
});
