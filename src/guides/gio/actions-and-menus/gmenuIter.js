const {Gio} = imports.gi;


const menuModel = new Gio.Menu();


/*
 * Get an attribute iterator for the item at index `0`
 */
const attrIter = menuModel.iterate_item_attributes(0);

while (attrIter.next()) {
    const attributeName = iter.get_name();
    const value = iter.get_value();
    let icon = null;

    switch (attributeName) {
        /*
         * This is the label of the menu item.
         */
        case Gio.MENU_ATTRIBUTE_LABEL:
            console.log(`${attributeName}: "${value.unpack()}"`);
            break;

        /*
         * Icons must be deserialized from GVariant to GIcon.
         */
        case Gio.MENU_ATTRIBUTE_ICON:
            icon = Gio.Icon.deserialize(value);

            console.log(`${attributeName}: ${icon.$gtype.name}`);
            break;

        /*
         * This is the GAction name (e.g. `quit`), but does not include the
         * namespace or scope (e.g. `app`). The full action name is something
         * like `app.quit`, although action names may also contain periods.
         */
        case Gio.MENU_ATTRIBUTE_ACTION:
            console.log(`${attributeName}: "${value.unpack()}"`);
            break;

        /*
         * This is the GAction namespace (e.g. `app`), which should combined
         * with the GAction name (e.g. `${actionNamespace}.${actionName}`).
         */
        case Gio.MENU_ATTRIBUTE_ACTION_NAMESPACE:
            console.log(`${attributeName}: "${value.unpack()}"`);
            break;

        /*
         * This is the activatable parameter, or stateful value of the action.
         */
        case Gio.MENU_ATTRIBUTE_TARGET:
            console.log(`${attributeName}: ${value.print(true)}`);
            break;

        /*
         * Handling custom attributes will require understanding how they are
         * intended to be used.
         */
        case 'my-custom-attribute':
        default:
            console.log(`${attributeName}: ${value.print(true)}`);
            break;
    }
}


/*
 * Get a link iterator for the item at index `0`.
 *
 * Links associate sections and submenus with a particular item.
 */
const linkIter = menuModel.iterate_item_links(0);

while (linkIter.next()) {
    const linkName = iter.get_name();
    const value = iter.get_value();

    switch (linkIter) {
        /*
         * This is a menu section, an instance of GMenuModel. Sections take the
         * place of a menu item, unlike submenus.
         */
        case Gio.MENU_LINK_SECTION:
            console.log(`${linkName}: ${value.$gtype.name}`);
            break;

        /*
         * This is a submenu, an instance of GMenuModel. Submenus are associated
         * with a menu item, unlike sections which are displayed in place of the
         * item.
         */
        case Gio.MENU_LINK_SUBMENU:
            console.log(`${linkName}: ${value.$gtype.name}`);
            break;

        /*
         * Handling custom link types will require understanding how they are
         * intended to be used.
         */
        case 'my-custom-link':
        default:
            console.log(`${linkName}: ${value.$gtype.name}`);
            break;
    }
}
