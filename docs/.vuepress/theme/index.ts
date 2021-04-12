import path from 'path';

export default {
    extends: '@vuepress/theme-default',
    clientAppEnhanceFiles: path.resolve(__dirname, './clientAppEnhance.ts'),
}