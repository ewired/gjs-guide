const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;


// Parent Menu
const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Menu Section
const section = new PopupMenu.PopupMenu();
section.addAction('Menu Item', () => console.log('activated'));

menu.addMenuItem(section);