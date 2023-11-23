module.exports = {
  title: '李吉磊 Blog',
  themeConfig: {
    nav: [
      { text: 'Github', link: 'https://github.com/lijileiGood/Blog' },
    ],
  },
  markdown: {
    extendMarkdown: md => {
      md.set({ breaks: true });
    }
  }
}