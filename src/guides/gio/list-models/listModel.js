const {Gio, GObject} = imports.gi;


var ArrayStore = GObject.registerClass({
    Implements: [Gio.ListModel],
}, class ArrayStore extends GObject.Object {
    constructor() {
        super();

        /* A native Array as internal storage for the list model */
        this.#items = [];
    }

    /*
     * Wrapping the internal iterable is an easy way to support `for..of` loops
     */
    *[Symbol.iterator]() {
        for (const item of this.#items)
            yield item;
    }

    /**
     * Gets the item at @position.
     *
     * If @position is greater than the number of items in the list, `null` is
     * returned. `null` is never returned for a position that is smaller than
     * the length of the list.
     *
     * @returns {GObject.Object|null} - the object at @position
     */
    vfunc_get_item(position) {
        return this.#items[position] || null;
    }

    /**
     * Gets the item type of the list.
     *
     * All items in the model must of this type, or derived from it. If the
     * type itself is an interface, the items must implement that interface.
     *
     * @returns {GObject.GType} the type of object in the list
     */
    vfunc_get_item_type() {
        return GObject.Object;
    }

    /**
     * Gets the number of items in the list.
     *
     * Depending on the model implementation, calling this function may be
     * less efficient than iterating the list with increasing values for
     * @position until `null` is returned.
     *
     * @returns {number} - a positive integer
     */
    vfunc_get_n_items() {
        return this.#items.length;
    }

    /*
     * NOTE: The methods below are not part of the GListModel interface.
     */

    /**
     * Insert an item in the list. If @position is greater than the number of
     * items in the list or less than `0` it will be appended to the end of the
     * list.
     *
     * @param {GObject.Object} item - the item to add
     * @param {number} [position] - the position to add the item
     */
    insertItem(item, position = -1) {
        // Type check the item
        if (!(item instanceof GObject.Object))
            throw TypeError(`Not a GObject: ${item.constructor.name}`);

        if (!GObject.type_is_a(item.constructor.$gtype, this.get_item_type())
            throw TypeError(`Invalid type: ${item.constructor.$gtype.name}`);

        // Normalize the position
        if (position < 0 || position > this.#items.length)
            position = this.#items.length;

        // Insert the item, then emit Gio.ListModel::items-changed
        this.#items.splice(position, 0, item);
        this.items_changed(position, 0, 1);
    }

    /**
     * Remove the item at @position. If @position is outside the length of the
     * list, this function does nothing.
     *
     * @param {number} position - the position of the item to remove
     */
    removeItem(position) {
        // NOTE: The Gio.ListModel interface will ensure @position is an
        //       unsigned integer, but other methods must check explicitly.
        if (position < 0 || position >= this.#items.length)
            return;

        // Remove the item and emit Gio.ListModel::items-changed
        this.#items.splice(position, 1);
        this.items_changed(position, 1, 0);
    }
});
