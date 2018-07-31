module.exports = {
  title: 'GNOME Javascript',
  description: 'A Guide To GNOME Javascript!',
  editLinks: true,
  dest: "public",
  themeConfig: {
    editLinks: true,
    repo: 'https://gitlab.com/gjs-guide/gjs-guide.gitlab.io/',
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
      '/examples/tags/': [
        '',
        '00-creating-user-interface',
        '01-writing-notes-saving-data',
        '02-tags-exiting-an-opened-file',
        '03-adding-a-new-view'
      ],
      '/': false
    }
  }
}