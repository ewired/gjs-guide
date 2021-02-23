import type { Plugin, PluginObject } from '@vuepress/core'
import { path } from '@vuepress/utils'

export const flexsearchPlugin: Plugin<{}> = ({

}) => {
    const plugin: PluginObject = {
        name: '@vuepress/plugin-flexsearch',
    }
    return {
        ...plugin,
        define: {
            DOCSEARCH_PROPS: {}
        },
        clientAppEnhanceFiles: path.resolve(
            __dirname,
            './clientAppEnhance.js'
        )
    }
}

export default flexsearchPlugin;