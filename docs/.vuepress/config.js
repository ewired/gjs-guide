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
        '01-the-basics',
        '02-widgets',
        '03-installing',
        '04-running-gtk-in-gjs',
        '05-creating-layouts-in-gtk',
        '06-displaying-text',
        '07-buttons',
        '08-editing-text',
        '09-images',
        '10-creating-a-user-interface',
        '11-building-an-application-gnome-builder',
        '12-templates',
        '13-saving-application-data',
        '14-application-settings',
        '15-localization',
        '16-dialogs'
      ],
      '/': false
    }
  }
}