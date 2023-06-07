---
title: Search Provider
---

# Search Provider

::: warning
This documentation is for GNOME Shell 43 and later.
:::

A search provider is a mechanism by which an application can expose its search
capabilities to GNOME Shell. Text from the search entry is forwarded to all
search providers, which may each return a set of search results.

Applications must register search providers by exporting a D-Bus service, while
GNOME Shell extensions can register search providers directly.

## Example Usage

GNOME Shell extensions create search providers by creating a class implementing
a [simple interface](#searchprovider). This class is responsible for returning a
list of results for a list of search terms.

Results are returned as unique string identifiers, which may be passed back to
the search provider to request [`ResultMeta`](#resultmeta) objects. These are
used by GNOME Shell to populate the results displayed to the user.

Search providers are constructed and then [registered](#registration) with GNOME
Shell, before they start receiving search requests.

### `ResultMeta`

The `ResultMeta` object is a light-weight metadata object, used to represent a
search result in the search view. Search providers must return objects of this
type when `SearchProvider.prototype.getResultMetas()` is called.

```js
/**
 * @typedef ResultMeta
 * @type {object}
 * @property {string} id - the unique identifier of the result
 * @property {string} name - the name of the result
 * @property {string} [description] - optional description of the result
 * @property {string} [clipboardText] - optional clipboard content
 * @property {function} createIcon - creates an icon for the result
 */
```

The `id` is the result identifier, as returned by the provider.

The `name` property holds a name or short description of the result.

The `description` property is optional, holding a longer description of the
result that is only displayed in the list view.

The `clipboardText` property is optional, holding text that will be copied to
the clipboard if the result is activated.

The `createIcon` property holds a function that takes a size argument and
returns a `Clutter.Actor`, usually an `St.Icon`:

```js
/**
 * Create an icon for a search result.
 *
 * Implementations may want to take scaling into consideration.
 *
 * @param {number} size - The requested size of the icon
 * @returns {Clutter.Actor} An icon
 */
function createIcon(size) {
    const { scaleFactor } = St.ThemeContext.get_for_stage(global.stage);
    
    return new St.Icon({
        icon_name: 'dialog-question',
        width: size * scaleFactor,
        height: size * scaleFactor,
    });
}
```

### `SearchProvider`

Below is the scaffolding for a search provider, with all properties and methods
documented.

@[code js](@src/extensions/topics/search-provider/searchProvider.js)

### Registration

Search providers from GNOME Shell extensions must be registered before they
become active. Registration should be performed in the `enable()` function and
then later unregistered in `disable()`.

@[code js](@src/extensions/topics/search-provider/extension.js)
