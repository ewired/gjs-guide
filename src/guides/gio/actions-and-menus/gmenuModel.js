const {Gio} = imports.gi;


const menuModel = new Gio.Menu();

menuModel.connect('items-changed', (menu, position, removed, added) => {
    console.log(`position: ${position}, removed: ${removed}, added: ${added}`);

    /* Items are added and removed from the same position, so the removals
     * must be handled first.
     *
     * NOTE: remember that the items have already changed in the model when this
     *       signal is emitted, so you can not query removed items.
     */
    while (removed--)
        console.log('removed an item');

    /* Once the removals have been processed, the additions must be inserted
     * at the same position.
     */
    for (let i = 0; i < added; i++)
        console.log('added an item');
});
