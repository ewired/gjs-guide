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
