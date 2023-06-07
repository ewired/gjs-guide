const PopupMenu = imports.ui.popupMenu;


const menuItem = new PopupMenu.PopupSwitchMenuItem('Item Label',
    true, {});

// Getting and setting the switch state (both calls are equivalent)
menuItem.setToggleState(!menuItem.state);
menuItem.toggle();

// Setting the label
menuItem.label.text = 'New Label';

// Watching the switch state and updating the switch label
menuItem.connect('toggled', (item, state) => {
    item.setStatusText(state ? 'On' : 'Off');
});
