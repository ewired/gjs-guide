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

```js
const { St } = imports.gi;


class SearchProvider {
    
    /**
     * The application of the provider.
     *
     * Applications will return a `Gio.AppInfo` representing themselves.
     * Extensions will usually return `null`.
     *
     * @type {Gio.AppInfo}
     */
    get appInfo() {
        return null;
    }
    
    /**
     * Whether the provider offers detailed results.
     *
     * Applications will return `true` if they have a way to display more
     * detailed or complete results. Extensions will usually return `false`.
     *
     * @type {boolean}
     */
    get canLaunchSearch() {
        return false;
    }
    
    /**
     * The unique ID of the provider.
     *
     * Applications will return their application ID. Extensions will usually
     * return their UUID.
     *
     * @type {string}
     */
    get id() {
        return imports.misc.extensionUtils.getCurrentExtension().uuid;
    }
    
    /**
     * Launch the search result.
     *
     * This method is called when a search provider result is activated.
     *
     * @param {string} result - The result identifier
     * @param {string[]} terms - The search terms
     */
    activateResult(result, terms) {
        console.debug(`activateResult(${result}, [${terms}])`);
    }

    /**
     * Launch the search provider.
     *
     * This method is called when a search provider is activated. A provider can
     * only be activated if the `appInfo` property holds a valid `Gio.AppInfo`
     * and the `canLaunchSearch` property is `true`.
     *
     * Applications will typically open a window to display more detailed or
     * complete results.
     *
     * @param {string[]} terms - The search terms
     */
    launchSearch(terms) {
        console.debug(`launchSearch([${terms}])`);
    }
    
    /**
     * Create a result object.
     *
     * This method is called to create an actor to represent a search result.
     *
     * Implementations may return any `Clutter.Actor` to serve as the display
     * result, or `null` for the default implementation.
     *
     * @param {ResultMeta} meta - A result metadata object
     * @returns {Clutter.Actor} An actor for the result
     */
    createResultObject(meta) {
        console.debug(`createResultObject(${meta.id})`);
        
        return null;
    }
    
    /**
     * Get result metadata.
     *
     * This method is called to get a `ResultMeta` for each identifier.
     *
     * @param {string[]} results - The result identifiers
     * @param {Gio.Cancellable} [cancellable] - A cancellable for the operation
     * @returns {Promise<ResultMeta[]>} A list of result metadata objects
     */
    getResultMetas(results, cancellable = null) {
        console.debug(`getResultMetas([${results}])`);
        
        const { scaleFactor } = St.ThemeContext.get_for_stage(global.stage);
        
        return new Promise((resolve, reject) => {
            const resultMetas = [];
            
            for (let identifier of results) {
                const meta = {
                    id: identifier,
                    name: 'Result Name',
                    description: 'The result description',
                    clipboardText: 'Content for the clipboard',
                    createIcon: (size) => {
                        return new St.Icon({
                            icon_name: 'dialog-question',
                            width: size * scaleFactor,
                            height: size * scaleFactor,
                        });
                    },
                };
                
                resultMetas.push(meta);
            }
            
            resolve(resultMetas);
        });
    }

    /**
     * Initiate a new search.
     *
     * This method is called to start a new search and should return a list of
     * unique identifiers for the results.
     *
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} [cancellable] - A cancellable for the operation
     * @returns {Promise<string[]>} A list of result identifiers
     */
    getInitialResultSet(terms, cancellable = null) {
        console.debug(`getInitialResultSet([${terms}])`);
        
        return new Promise((resolve, reject) => {
            const identifiers = [
                'result-01',
                'result-02',
                'result-03',
            ];
            
            resolve(identifiers);
        });
    }

    /**
     * Refine the current search.
     *
     * This method is called to refine the current search results with
     * expanded terms and should return a subset of the original result set.
     *
     * Implementations may use this method to refine the search results more
     * efficiently than running a new search, or simply pass the terms to the
     * implementation of `getInitialResultSet()`.
     *
     * @param {string[]} results - The original result set
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} [cancellable] - A cancellable for the operation
     * @returns {Promise<string[]>}
     */
    getSubsearchResultSet(results, terms, cancellable = null) {
        console.debug(`getSubsearchResultSet([${results}], [${terms}])`);
        
        return this.getInitialResultSet(terms, cancellable);
    }

    /**
     * Filter the current search.
     *
     * This method is called to truncate the number of search results.
     *
     * Implementations may use their own criteria for discarding results, or
     * simply return the first n-items.
     *
     * @param {string[]} results - The original result set
     * @param {number} maxResults - The maximum amount of results
     * @returns {string[]} The filtered results
     */
    filterResults(results, maxResults) {
        console.debug(`filterResults([${results}], ${maxResults})`);
        
        if (results.length <= maxNumber)
            return results;
        
        return results.slice(0, maxResults);
    }
}
```

### Registration

Search providers from GNOME Shell extensions must be registered before they
become active. Registration should be performed in the `enable()` function and
then later unregistered in `disable()`.

```js
const Main = imports.ui.main;

// This is the live instance of the Search Results view
const SearchResults = Main.overview._overview._controls._searchController._searchResults;


class Extension {
    constructor() {
        this._provider = null;
    }

    enable() {
        /* Register when enabled */
        if (this._provider === null) {
            this._provider = new SearchProvider();
            SearchResults._registerProvider(this._provider);
        }
    }

    disable() {
        /* Unregister when disabled */
        if (this._provider instanceof SearchProvider) {
            SearchResults._unregisterProvider(this._provider);
            this._provider = null;
        }
    }
}

function init(meta) {
    return new Extension();
}
```
