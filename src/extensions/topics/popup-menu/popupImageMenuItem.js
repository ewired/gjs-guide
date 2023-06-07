const PopupMenu = imports.ui.popupMenu;


const menuItem = new PopupMenu.PopupImageMenuItem('Item Label',
    'info-symbolic', {});

// Setting the icon, by method or property
menuItem.setIcon('info-symbolic');
menuItem.icon.icon_name = 'info-symbolic';

// Setting the label
menuItem.label.text = 'New Label';
