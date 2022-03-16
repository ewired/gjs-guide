import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
import path from 'path';

export default defineUserConfig<DefaultThemeOptions>({
  title: 'GNOME Javascript',
  description: 'A Guide To GNOME Javascript!',
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

  theme: path.resolve(__dirname, './theme/index.ts'),
  themeConfig: {
    editLinks: true,
    siteBrandLogo: true,
    repo: 'https://gitlab.gnome.org/ewlsh/gjs-guide',
    docsBranch: 'main',
    logo: '/logo.svg',
    logoDark: '/logo-dark.svg',
    docsDir: 'docs',
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'About',
        link: '/about/',
      },
      {
        text: 'Guides',
        link: '/guides/',
      },
      {
        text: 'Showcase',
        link: '/showcase/',
      },
      {
        text: 'Extensions',
        link: '/extensions/',
      },
      {
        text: 'API References',
        link: 'https://gjs-docs.gnome.org',
      },
    ],
    sidebar: {
      '/guides/': [
        {
          text: 'Guides',
          children: [
            {
              text: 'GJS',
              children: [
                '/guides/gjs/intro.md',
                '/guides/gjs/features-across-versions.md',
                '/guides/gjs/legacy-class-syntax.md',
                '/guides/gjs/style-guide.md',
                '/guides/gjs/asynchronous-programming.md',
                '/guides/gjs/memory-management.md',
              ],
            },
            {
              text: 'GObject',
              children: [
                '/guides/gobject/basics.md',
                '/guides/gobject/interfaces.md',
                '/guides/gobject/subclassing.md',
                '/guides/gobject/gtype.md',
              ],
            },
            {
              text: 'GTK',
              children: [
                '/guides/gtk/3/',
                '/guides/gtk/application-packaging.md',
              ],
            },
            {
              text: 'GLib',
              children: ['/guides/glib/gvariant.md'],
            },
            {
              text: 'Gio',
              children: [
                '/guides/gio/dbus.md',
                '/guides/gio/file-operations.md',
                '/guides/gio/subprocesses.md',
              ],
            },
          ],
        },
      ],
      '/guides/gjs/': [
        {
          text: 'GJS',

          children: [
            '/guides/gjs/intro.md',
            '/guides/gjs/features-across-versions.md',
            '/guides/gjs/legacy-class-syntax.md',
            '/guides/gjs/style-guide.md',
            '/guides/gjs/asynchronous-programming.md',
            '/guides/gjs/memory-management.md',
          ],
        },
      ],
      '/guides/gobject/': [
        {
          text: 'GObject',

          children: [
            '/guides/gobject/basics.md',
            '/guides/gobject/interfaces.md',
            '/guides/gobject/subclassing.md',
            '/guides/gobject/gtype.md',
          ],
        },
      ],
      '/guides/gtk/': [
        {
          text: 'GTK',
          children: ['/guides/gtk/3/', '/guides/gtk/application-packaging/'],
        },
      ],
      '/guides/glib/': [
        {
          text: 'GLib',
          children: ['/guides/glib/gvariant.md'],
        },
      ],
      '/guides/gio/': [
        {
          text: 'Gio',
          children: [
            '/guides/gio/dbus.md',
            '/guides/gio/file-operations.md',
            '/guides/gio/subprocesses.md',
          ],
        },
      ],
      '/guides/gtk/3/': [
        {
          text: 'GTK3',
          children: [
            '/guides/gtk/3/README.md',
            '/guides/gtk/3/01-basics.md',
            '/guides/gtk/3/02-widgets.md',
            '/guides/gtk/3/03-installing.md',
            '/guides/gtk/3/04-running-gtk.md',
            '/guides/gtk/3/05-layouts.md',
            '/guides/gtk/3/06-text.md',
            '/guides/gtk/3/07-buttons.md',
            '/guides/gtk/3/08-editing-text.md',
            '/guides/gtk/3/09-images.md',
            '/guides/gtk/3/10-building-app.md',
            '/guides/gtk/3/11-packaging.md',
            '/guides/gtk/3/12-app-dev.md',
            '/guides/gtk/3/13-ui.md',
            '/guides/gtk/3/14-templates.md',
            '/guides/gtk/3/15-saving-data.md',
            '/guides/gtk/3/16-settings.md',
            '/guides/gtk/3/17-dialogs.md',
          ],
        },
      ],
      '/extensions/': [
        {
          text: 'Extensions',
          children: [
            {
              text: 'Development',

              children: [
                '/extensions/development/creating.md',
                '/extensions/development/debugging.md',
                '/extensions/development/preferences.md',
                '/extensions/development/translations.md',
                '/extensions/development/targeting-older-gnome.md',
              ],
            },
            {
              text: 'Overview',

              children: [
                '/extensions/overview/anatomy.md',
                '/extensions/overview/architecture.md',
                '/extensions/overview/imports-and-modules.md',
                '/extensions/overview/updates-and-breakage.md',
              ],
            },
            {
              text: 'Upgrading',

              children: [
              	'/extensions/upgrading/gnome-shell-42.md',
              	'/extensions/upgrading/gnome-shell-40.md',
              ],
            },
            {
              text: 'Review Guidelines',

              children: ['/extensions/review-guidelines/review-guidelines.md'],
            },
          ],
        },
      ],
      '/extensions/development/': [
        {
          text: 'Development',

          children: [
            '/extensions/development/creating.md',
            '/extensions/development/debugging.md',
            '/extensions/development/preferences.md',
            '/extensions/development/translations.md',
            '/extensions/development/targeting-older-gnome.md',
          ],
        },
      ],
      '/extensions/overview/': [
        {
          text: 'Overview',

          children: [
            '/extensions/overview/anatomy.md',
            '/extensions/overview/architecture.md',
            '/extensions/overview/imports-and-modules.md',
            '/extensions/overview/updates-and-breakage.md',
          ],
        },
      ],
      '/extensions/upgrading/': [
        {
          text: 'Upgrading',

          children: [
            '/extensions/upgrading/gnome-shell-42.md',
            '/extensions/upgrading/gnome-shell-40.md',
          ],
        },
      ],
    },
  },
});
