const {Gio} = imports.gi;


const menuModel = new Gio.Menu();


/*
 * Submenus should group related items, that follow logically from the parent.
 */
const menuSubmenu = new Gio.Menu();
menuSubmenu.append('Open', 'win.open');
menuSubmenu.append('Open In New Tab', 'win.open-tab');
menuSubmenu.append('Open In New Window', 'win.open-window');
menuModel.append_submenu('Open', menuSubmenu);


/*
 * Menu sections should group related items, while other items should be in
 * their own section, or stand-alone items.
 *
 * If a label is given when adding the section, it will usually be presented in
 * way that associates it with the separator.
 */
const metaSection = new Gio.Menu();
menuSection.append('Preferences', 'app.preferences');
menuSection.append('Help', 'app.help');
menuSection.append('About GJS', 'app.about');
menuModel.append_section(null, metaSection);

const quitSection = new Gio.Menu();
menuSection.append('Quit', 'app.quit');
menuModel.append_section(null, quitSection);
