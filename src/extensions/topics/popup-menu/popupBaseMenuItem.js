const Clutter = imports.gi.Clutter;
const PopupMenu = imports.ui.popupMenu;


// PopupMenuItem is a subclass of PopupBaseMenuItem
const menuItem = new PopupMenu.PopupMenuItem('Item Label', {
    active: false,
    can_focus: true,
    hover: true,
    reactive: true,
    style_class: 'my-menu-item',
});

// Adding an ornament
menuItem.setOrnament(PopupMenu.Ornament.CHECK);

// Disabling the item (active property will no longer change)
menuItem.sensitive = false;

// Watching the `activate` signal
menuItem.connect('activate', (item, event) => {
    // Do something special for pointer buttons
    if (event.get_type() === Clutter.EventType.BUTTON_PRESS)
        console.log('Pointer was pressed!');

    return Clutter.EVENT_PROPAGATE;
});
