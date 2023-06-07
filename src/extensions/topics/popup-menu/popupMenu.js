const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;


const sourceActor = new St.Widget();
const menu = new PopupMenu.PopupMenu(sourceActor, 0.0, St.Side.TOP);

// Adding items
menu.addAction('Menu Item', () => console.log('activated'));
