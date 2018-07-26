module.exports = {
  title: 'GNOME Javascript',
  description: 'A Guide To GNOME Javascript',
  editLinks: true,
  themeConfig: {
    logo: '/logo.svg',
    docsDir: 'docs',
    nav: [{
        text: 'Home',
        link: '/'
      },
      {
        text: 'Tutorials',
        link: '/tutorials/'
      },
      {
        text: 'Building Your First App',
        link: '/tags/'
      },
      {
        text: 'API',
        link: 'https://devdocs.baznga.org'
      },
    ],
    sidebar: {
      '/tutorials/': [
        '',
        'gjs-features-across-versions',
        'gjs-style-guide',
        'gjs-basic-file-operations',
        'gjs-gtk-application-packaging',
        'gjs-gtk-templating',
        'gjs-legacy-class-syntax'
      ],
      '/tags/': [
        '',
        '01-writing-notes-saving-data',
        '02-tags-exiting-an-opened-file',
      ],
      '/': false
    }
  }
}