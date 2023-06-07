const PopupMenu = imports.ui.popupMenu;


const menuItem = new PopupMenu.PopupSubMenuMenuItem('Item Label',
    true, {});

// Setting the icon
menuItem.icon.icon_name = 'info-symbolic';

// Setting the label
menuItem.label.text = 'New Label';

// Adding items
menuItem.menu.addAction('Submenu Item 1', () => console.log('activated'));
menuItem.menu.addAction('Submenu Item 2', () => console.log('activated'));
