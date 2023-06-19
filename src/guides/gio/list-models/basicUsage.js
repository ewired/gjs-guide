const {Gio, GObject} = imports.gi;


/* This array will take the place of a list view, or other widget.
 *
 * Internally, many widgets like GtkListBox will operate in a very similar way,
 * connecting the `items-changed` signal to create and destroy widgets at the
 * correct position.
 */
const listWidget = new Array();


const listStore = Gio.ListStore.new(Gio.File);

listStore.connect('items-changed', (list, position, removed, added) => {
    console.log(`position: ${position}, removed: ${removed}, added: ${added}`);

    /* Items are added and removed from the same position, so the removals
     * must be handled first.
     *
     * NOTE: remember that the items have already changed in the model when this
     *       signal is emitted, so you can not query removed objects.
     */
    while (removed--)
        listWidget.splice(position, 1);

    /* Once the removals have been processed, the additions must be inserted
     * at the same position.
     */
    for (let i = 0; i < added; i++)
        listWidget.splice(position + i, 0, list.get_item(position + i));
});


/* Splicing the items will result in a single emission of `items-changed`, with
 * a callback signature of `position = 0, removed = 0, added = 3`.
 *
 * Sorting the items will result in a single emission of `items-changed`, with
 * a callback signature of `position = 0, removed = 3, added = 3`.
 */
listStore.splice(0, 0, [
    Gio.File.new_for_path('/'),
    Gio.File.new_for_path('/home'),
    Gio.File.new_for_path('/home/user'),
]);

listStore.sort((object1, object2) => {
    return object1.get_path().localeCompare(object2.get_path());
});


/* Inserting one at a time results in a three emissions of `items-changed`, with
 * a callback signature of `position = ?, removed = 0, added = 1`.
 *
 * WARNING: when using a sorted list model all items must be sorted, with the
 *          same sorting function, or the list behavior becomes undefined.
 */
const moreItems = [
    Gio.File.new_for_path('/home/user/Downloads'),
    Gio.File.new_for_path('/home/user/Downloads/TV'),
    Gio.File.new_for_path('/home/user/Downloads/TV/Teddy Ruxpin'),
];

for (const item of moreItems) {
    listStore.insert_sorted(item, (object1, object2) => {
        return object1.get_path().localeCompare(object2.get_path());
    });
}


/* We should now be in state where the number and order of items is the same,
 * both in the list model and the list consumer.
 */
if (listStore.n_items !== listWidget.length)
    throw Error('Should never be thrown');

for (let i = 0; i < listStore.n_items; i++) {
    if (listWidget[i] !== listStore.get_item(i))
        throw Error('Should never be thrown');
}
