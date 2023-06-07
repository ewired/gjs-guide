import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
import path from 'path';

import navbar from './config/navbar';
import sidebar from './config/sidebar';

export default defineUserConfig<DefaultThemeOptions>({
  title: 'GNOME JavaScript',
  description: 'A Guide To GNOME JavaScript!',
  base: process.env.VUEPRESS_BASE_URL ?? '/',
  dest: 'public',
  plugins: [
    path.resolve(__dirname, './plugins/flexsearch/dist/injectSearch.js'),
    [
      '@vuepress/plugin-shiki',
      {
        langs: ['javascript', 'typescript', 'xml', 'bash', 'css', 'json'],
      },
    ],
  ],

  markdown: {
    importCode: {
      handleImportPath: (str) =>
        str.replace(/^@src/, path.resolve(__dirname, './../../src')),
    },
  },

  theme: path.resolve(__dirname, './theme/index.ts'),
  themeConfig: {
    editLinks: true,
    siteBrandLogo: true,
    repo: 'https://gitlab.gnome.org/ewlsh/gjs-guide',
    docsBranch: 'main',
    logo: '/logo.svg',
    logoDark: '/logo-dark.svg',
    docsDir: 'docs',
    navbar,
    sidebar,
    bundlerConfig: {
      configureWebpack() {
        // Workaround for https://github.com/webpack/webpack/issues/14532
        return {
          output: {
            hashFunction: 'xxhash64'
          }
        }
      }
    }
  }
});
