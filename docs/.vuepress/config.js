module.exports = {
  title: '李吉磊 Blog',
  themeConfig: {
    nav: [
      {text: 'Github', link: 'https://github.com/lijileiGood/lijileiGood.github.io'},
    ],
  },
  markdown: {
    extendMarkdown: md => {
      md.set({
        // /n换行
        breaks: true,
        // 支持文本中有<>
        html: false,
      });
    }
  }
}