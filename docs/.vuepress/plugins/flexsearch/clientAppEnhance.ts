import { h } from 'vue'
import Flexsearch from './Flexsearch'
import {
    defineClientAppEnhance,
} from '@vuepress/client';

// The default theme currently expects DOCSEARCH_PROPS
// to enable a searchbar.
globalThis.DOCSEARCH_PROPS = {}

export default defineClientAppEnhance(({ app }) => {
    // Once VuePress v2 supports SearchBox
    // instead of Docsearch we can avoid
    // aliasing Flexsearch like this.
    app.component('Docsearch', {
        setup() {
            return () => h(Flexsearch);
        },
    })
})