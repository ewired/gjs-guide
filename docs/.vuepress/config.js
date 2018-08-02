module.exports = {
  title: 'GNOME Javascript',
  description: 'A Guide To GNOME Javascript!',
  editLinks: true,
  dest: "public",
  themeConfig: {
    editLinks: true,
    repo: 'https://gitlab.com/gjs-guide/gjs-guide.gitlab.io/',
    docsBranch: 'gitlab-master',
    logo: '/logo.svg',
    docsDir: 'docs',
    nav: [{
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
        text: 'API References',
        link: 'https://devdocs.baznga.org'
      },
    ],
    sidebar: {
      '/examples/tags/': [
        '',
        '00-creating-user-interface',
        '01-writing-notes-saving-data',
        '02-tags-exiting-an-opened-file',
        '03-adding-a-new-view'
      ],
      '/guides/gtk/gtk-tutorial/': [
        '',
        '01-basics',
        '02-widgets',
        '03-installing',
        '04-running-gtk',
        '05-layouts',
        '06-text',
        '07-buttons',
        '08-editing-text',
        '09-images',
        '10-building-app',
        '11-packaging',
        '12-app-dev',
        '13-ui',
        '14-templates',
        '15-saving-data',
        '16-settings',
        '17-dialogs',
        '18-localization'
      ],
      '/': false
    }
  }
}