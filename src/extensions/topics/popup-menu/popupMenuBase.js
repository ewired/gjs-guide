const St = imports.gi.St;

const BoxPointer = imports.ui.BoxPointer;
const PopupMenu = imports.ui.popupMenu;


const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Adding items
const menuItem1 = menu.addAction('Item 1', () => console.log('activated'));

const menuItem2 = new PopupMenu.PopupMenuItem('Item 2');
menu.addMenuItem(menuItem2, 0);

// Moving items
menu.moveMenuItem(menuItem2, 1);

// Opening and closing menus
menu.open(BoxPointer.PopupAnimation.FADE);
menu.close(BoxPointer.PopupAnimation.NONE);

// Removing items
menuItem1.destroy();
menu.removeAll();
