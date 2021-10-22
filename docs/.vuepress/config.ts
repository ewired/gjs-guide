import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import path from 'path';

export default defineUserConfig<DefaultThemeOptions>({
  title: 'GNOME Javascript',
  description: 'A Guide To GNOME Javascript!',
  base: process.env.VUEPRESS_BASE_URL ?? '/',
  dest: 'public',
  plugins: [
    path.resolve(__dirname, './plugins/flexsearch/dist/injectSearch.js'),
    ['@vuepress/plugin-shiki', {
      langs: [
        'javascript',
        'typescript',
        'xml',
        'bash',
        'css',
        'json'
      ]
    }]
  ],

  theme: path.resolve(__dirname, './theme/index.ts'),
  themeConfig: {
    editLinks: true,
    siteBrandLogo: true,
    repo: 'https://gitlab.gnome.org/ewlsh/gjs-guide',
    docsBranch: 'main',
    logo: '/logo.svg',
    docsDir: 'docs',
    navbar: [
      {
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
      }
    ],
    sidebar: {
      '/guides/': [
        {
          isGroup: true,
          text: 'Guides',
          children: [
            {
              text: 'GJS',
              isGroup: true,
              children: [
                '/guides/gjs/intro.md',
                '/guides/gjs/features-across-versions.md',
                '/guides/gjs/legacy-class-syntax.md',
                '/guides/gjs/style-guide.md',
                '/guides/gjs/memory-management.md',
              ]
            },
            {
              text: 'GObject',
              isGroup: true,
              children: [
                '/guides/gobject/basics.md',
                '/guides/gobject/interfaces.md',
                '/guides/gobject/subclassing.md',
                '/guides/gobject/gtype.md',
              ]
            },
            {
              text: 'GTK',
              isGroup: true,
              children: [
                '/guides/gtk/3/',
                '/guides/gtk/application-packaging.md'
              ]
            },
            {
              text: 'GLib',
              isGroup: true,
              children: [
                '/guides/glib/gvariant.md',
              ]
            },
            {
              text: 'Gio',
              isGroup: true,
              children: [
                '/guides/gio/file-operations.md',
                '/guides/gio/subprocesses.md',
              ]
            }

          ]
        }
      ],
      '/guides/gjs/': [{
        text: 'GJS',
        isGroup: true,
        children: [
          '/guides/gjs/intro.md',
          '/guides/gjs/features-across-versions.md',
          '/guides/gjs/legacy-class-syntax.md',
          '/guides/gjs/style-guide.md',
          '/guides/gjs/memory-management.md',
        ]
      }],
      '/guides/gobject/': [{
        text: 'GObject',
        isGroup: true,
        children: [
          '/guides/gobject/basics.md',
          '/guides/gobject/interfaces.md',
          '/guides/gobject/subclassing.md',
          '/guides/gobject/gtype.md',
        ]
      }],
      '/guides/gtk/': [{
        text: 'GTK',
        isGroup: true,
        children: [
          '/guides/gtk/3/',
          '/guides/gtk/application-packaging/'
        ]
      }],
      '/guides/glib/': [{
        text: 'GLib',
        isGroup: true,
        children: [
          '/guides/glib/gvariant.md',
        ]
      }],
      '/guides/gio/': [{
        text: 'Gio',
        isGroup: true,
        children: [
          '/guides/gio/file-operations.md',
          '/guides/gio/subprocesses.md',
        ]
      }],
      '/guides/gtk/3/': [{
        isGroup: true,
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
        ]
      }],
      '/extensions/': [
        {
          isGroup: true,
          text: 'Extensions',
          children: [
            {
              text: "Development",
              isGroup: true,
              children: [
                "/extensions/development/creating.md",
                "/extensions/development/debugging.md",
                "/extensions/development/preferences.md",
                "/extensions/development/translations.md",
              ]
            },
            {
              text: "Overview",
              isGroup: true,
              children: [
                "/extensions/overview/anatomy.md",
                "/extensions/overview/architecture.md",
                "/extensions/overview/imports-and-modules.md",
              ]
            },
            {
              text: "Upgrading",
              isGroup: true,
              children: [
                "/extensions/upgrading/gnome-shell-40.md"
              ]
            },
            {
              text: "Review Guidelines",
              isGroup: true,
              children: [
                "/extensions/review-guidelines/review-guidelines.md"
              ]
            }
          ]
        }
      ],
      '/extensions/development/': [{
        text: "Development",
        isGroup: true,
        children: [
          "/extensions/development/creating.md",
          "/extensions/development/debugging.md",
          "/extensions/development/preferences.md",
          "/extensions/development/translations.md",
        ]
      }],
      '/extensions/overview/': [
        {
          text: "Overview",
          isGroup: true,
          children: [
            "/extensions/overview/anatomy.md",
            "/extensions/overview/architecture.md",
            "/extensions/overview/imports-and-modules.md",
          ]
        }],
      '/extensions/upgrading/': [{
        text: "Upgrading",
        isGroup: true,
        children: [
          "/extensions/upgrading/gnome-shell-40.md"
        ]
      }]
    },
  }
});
