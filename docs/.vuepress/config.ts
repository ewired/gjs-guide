import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import path from 'path';

export default defineUserConfig<DefaultThemeOptions>({
  title: 'GNOME Javascript',
  description: 'A Guide To GNOME Javascript!',
  dest: "public",
  plugins: [
    path.resolve(__dirname, "./plugins/flexsearch/dist/injectSearch.js")
  ],
  theme: path.resolve(__dirname, "./theme/index.ts"),
  themeConfig: {
    editLinks: true,
    siteBrandLogo: true,
    repo: 'https://gitlab.gnome.org/ewlsh/gjs-guide',
    docsBranch: 'main',
    logo: '/logo.svg',
    docsDir: 'docs',
    navbar: [{
      text: 'Home',
      link: '/'
    },
    {
      text: 'About',
      link: '/about/'
    },
    {
      text: 'Guides',
      link: '/guides/'
    },
    {
      text: 'Showcase',
      link: '/showcase/'
    },
    {
      text: 'Extensions',
      link: '/extensions/'
    },
    {
      text: 'API References',
      link: 'https://gjs-docs.gnome.org'
    },
    ]
  }
});
