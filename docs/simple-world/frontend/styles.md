---
title: 样式
sidebar_position: 2
---

所有前端实现都应该使用主仓库中共享的 [styles.css](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css) 文件。这是一个单独的 CSS 文件，包含简单论坛页面实际使用的 class。

它提供的 CSS class 与[模板](/docs/simple-world/frontend/templates/)以及 [E2E 测试选择器契约](https://github.com/realworld-apps/realworld/blob/main/specs/e2e/SELECTORS.md)相匹配。

### 字体和图标

`styles.css` 只包含布局和组件样式，**不**内置字体或图标，所以请在 `<head>` 中单独加载它们：

- **字体：** 主题使用 `Source Sans Pro`（正文）和 `Lora`（标题/文章文本）。如果没有加载它们，浏览器会回退到通用 sans-serif/serif 字体。你可以用自己喜欢的方式加载它们（例如 Google Fonts）。
- **图标：** 模板使用旧版 [Ionicons](https://ionic.io/ionicons) v2 图标集中的 `ion-*` class（`ion-compose`、`ion-edit`、`ion-trash-a`、`ion-close-round`）。请加载提供这些 class 的图标样式表，或替换成你自己的等效图标。

### 默认头像

系统不需要上传头像。
