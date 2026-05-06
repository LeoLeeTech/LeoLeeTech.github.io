这个项目是基于 [LeoLeeTech/LeoLeeTech.github.io](https://github.com/LeoLeeTech/LeoLeeTech.github.io) 的博客站点代码。
技术栈核心是 `Next.js App Router + Contentlayer + MDX + Tailwind CSS + Pliny`。

下面按根目录展示顺序说明：先列出所有文件夹，再列出所有文件。

## 纯本地 .contentlayer/
Contentlayer 的本地构建产物目录，通常不手动修改。

## .devcontainer/
开发容器配置目录。

- `devcontainer.json`：容器镜像、启动命令、端口与插件配置。

## .github/
GitHub 平台配置目录。

- `workflows/pages.yml`：GitHub Pages 自动构建/部署流程。
- `FUNDING.yml`：赞助配置。

## .husky/
Git hooks 配置。

- `pre-commit`：提交前执行 `lint-staged`。

## 纯本地 .idea/
JetBrains IDE 本地工程配置目录，通常本地生成，不入库。

## 纯本地 .next/
Next.js 运行/构建产物目录，本地纯本地，不手改。

## .vscode/
VS Code 工作区配置。

- `settings.json`：TypeScript SDK 等编辑器设置。

## .yarn/
Yarn Berry 目录。

- `cache/`：依赖离线缓存。
- `releases/`：固定版本 Yarn。
- `install-state.gz`：安装状态缓存。

## app/
Next.js App Router 主目录，负责页面路由、布局、SEO 和 API。

- `layout.tsx`：全站根布局（Header/Footer、主题、搜索、分析等）。
- `page.tsx`：首页路由。
- `Main.tsx`：首页文章列表渲染。
- `blog/[...slug]/page.tsx`：文章详情页。
- `blog/page.tsx`、`blog/page/[page]/page.tsx`：文章列表与分页。
- `tags/`：标签页、标签详情和分页。
- `about/page.tsx`、`projects/page.tsx`：关于页、项目页。
- `api/newsletter/route.ts`：订阅 API。
- `seo.tsx`、`robots.ts`、`sitemap.ts`：SEO、爬虫和站点地图。
- `tag-data.json`：标签统计数据（构建流程会更新）。

## components/
可复用 UI 组件目录。

- `Header.tsx`、`Footer.tsx`：站点头部/底部。
- `MobileNav.tsx`：移动端菜单。
- `ThemeSwitch.tsx`：主题切换。
- `SearchButton.tsx`：搜索入口。
- `Link.tsx`、`Image.tsx`、`Tag.tsx`：基础组件封装。
- `MDXComponents.tsx`：MDX 组件映射。
- `Comments.tsx`：评论组件。
- `ScrollTopAndComment.tsx`：返回顶部/评论快捷按钮。
- `Card.tsx`、`PageTitle.tsx`、`SectionContainer.tsx`、`TableWrapper.tsx`：布局与展示组件。
- `social-icons/`：社交图标定义与导出。

## css/
全局样式目录。

- `tailwind.css`：Tailwind v4 主题变量和全局样式。
- `prism.css`：代码高亮样式。

## data/
站点内容与配置数据目录。

- `siteMetadata.js`：站点核心配置（标题、域名、评论、搜索、分析等）。
- `headerNavLinks.ts`：顶部导航配置。
- `projectsData.ts`：项目页数据。
- `authors/`：作者资料 MDX。
- `blog/`：文章 MDX 内容。
- `logo.svg`、`references-data.bib`：Logo 与引用数据。

## faq/
FAQ 和使用说明文档目录。

- `custom-mdx-component.md`：MDX 扩展说明。
- `customize-kbar-search.md`：搜索定制说明。
- `deploy-with-docker.md`：Docker 部署说明。

## layouts/
页面布局模板目录。

- `PostLayout.tsx`：文章详情布局（正文、评论、上一篇/下一篇）。
- `ListLayout.tsx`、`ListLayoutWithTags.tsx`：文章列表布局。
- `AuthorLayout.tsx`：作者页布局。

## 纯本地 node_modules/
依赖安装目录，执行 `yarn`/`npm` 后本地生成，不入库。

## public/
静态资源目录。

- `static/favicons/`：站点图标。
- `static/images/`：图片资源。
- `search.json`：纯本地的本地搜索索引（通常不入库）。

## scripts/
构建后处理脚本目录。

- `postbuild.mjs`：构建完成后的任务入口。
- `rss.mjs`：RSS 生成脚本。

## .env.example
环境变量示例模板（评论系统、Newsletter 等）。

## .gitattributes
Git 属性配置（行尾规则、文本/二进制策略）。

## .gitignore
Git 忽略规则（构建产物、依赖目录、日志等）。

## .yarnrc.yml
Yarn 配置文件（`nodeLinker`、`yarnPath`）。

## CNAME.txt
自定义域名配置（`leolee.tech`）。

## contentlayer.config.ts
Contentlayer 配置入口。

- 定义文档模型（`Blog`、`Authors`）。
- 配置 remark/rehype 插件。
- 生成标签统计与搜索索引。

## eslint.config.mjs
ESLint Flat Config 配置（TS、Next、Prettier、a11y 规则）。

## jsconfig.json
路径别名配置（`@/components/*`、`@/data/*` 等）。

## next-env.d.ts
Next.js 纯本地的 TypeScript 环境声明。

## next.config.js
Next.js 配置入口。

- 集成 Contentlayer 与 Bundle Analyzer。
- 配置安全头（CSP 等）。
- 配置 `basePath`、导出模式、图片策略与 SVG 规则。

## package.json
项目脚本与依赖清单。

- 常用脚本：`dev`、`build`、`serve`、`lint`、`analyze`。
- `build` 后会执行 `scripts/postbuild.mjs`。

## postcss.config.js
PostCSS 配置（启用 `@tailwindcss/postcss`）。

## prettier.config.js
Prettier 配置（包含 `prettier-plugin-tailwindcss`）。

## tsconfig.json
TypeScript 编译配置（路径别名、包含范围、编译行为）。

## yarn.lock
Yarn 锁文件，保证依赖版本可复现。
