const {Gio, GObject} = imports.gi;


const listStore = Gio.ListStore.new(GObject.TYPE_OBJECT);

listStore.connect('items-changed', (_list, position, removed, added) => {
    console.log(`${removed} items were removed, and ${added} added at ${position}`);
});

const listItems = [
    new GObject.Object(),
    new GObject.Object(),
    new GObject.Object(),
];


/*
 * Adding and removing items
 */
listStore.append(listItems[0]);
listStore.insert(1, listItems[1]);
listStore.splice(2, 0, [listItems[2]]);

listStore.remove(0);


/*
 * Sorting items, and sorting while adding items.
 *
 * NOTE: This function must be deterministic to ensure a stable sort.
 */
function sortFunc(object1, object2) {
    // Return: `-1` if `object1` should be before `object2`
    //          `0` if the objects are equivalent
    //          `1` if `object1` should be after `object2`
    return 0;
}

listStore.sort(sortFunc);

listStore.insert_sorted(new GObject.Object(), sortFunc);


/*
 * Finding items
 */
function findFunc(object1, object2) {
    return object1 === object2;
}


let [found, position] = listStore.find(listItems[0]);

if (found)
    console.log('This item will not be found, because it was already removed');


[found, position] = listStore.find_with_equal_func(listItems[1], findFunc);

if (found) {
    console.log(`The item found at position ${position} will be removed`);
    listStore.remove(position);
}
