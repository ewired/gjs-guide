module.exports = {
  title: 'GNOME Javascript',
  description: 'A Guide To GNOME Javascript',
  editLinks: true,
  dest: "public",
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
        text: 'Examples',
        link: '/examples/'
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
      '/tutorials/': [
        '',
        'gjs-features-across-versions',
        'gjs-style-guide',
        'gjs-basic-file-operations',
        'gjs-gtk-application-packaging',
        'gjs-gtk-templating',
        'gjs-legacy-class-syntax'
      ],
      '/examples/tags/': [
        '',
        '00-creating-user-interface',
        '01-writing-notes-saving-data',
        '02-tags-exiting-an-opened-file',
      ],
      '/': false
    }
  }
}