---
title: 模板
sidebar_position: 1
---

## Head 元素

`<head>` 元素包含页面元数据（标题、描述）并加载样式表。

加载共享的 [苹果社区主题](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css)，以及它依赖的字体和图标。`styles.css` **不**内置字体或图标，所以下方 head 会同时加载这三类资源；详情见[样式](/docs/simple-world/frontend/styles/)页面。

```html
<head>
  <meta charset="utf-8" />
  <title>苹果社区</title>
  <!-- 图标：下方模板会用到 ion-* class（旧版 Ionicons v2） -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"
  />
  <!-- 字体：主题依赖的字体 -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700|Lora:400,700"
  />
  <!-- 共享主题：请在你自己的应用里提供 styles.css -->
  <link rel="stylesheet" href="/styles.css" />
</head>
```

## 布局

### 页头

苹果社区只保留首页和新建文章入口。

```html
<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">苹果社区</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item">
        <!-- 当前页面对应的链接加上 active class -->
        <a class="nav-link active" href="/">首页</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/editor"> <i class="ion-compose"></i>&nbsp;发布文章 </a>
      </li>
    </ul>
  </div>
</nav>
```

### 页脚

```html
<footer>
  <div class="container">
    <a href="/" class="logo-font">苹果社区</a>
    <span class="attribution">
      一个用于学习的互动项目。代码和设计基于 MIT 协议开放。
    </span>
  </div>
</footer>
```

## 页面

### 首页

首页包含全局文章列表、可选的标签筛选和分页。文章作者头像使用用户名首字母大写，不需要上传图片。

```html
<div class="home-page">
  <div class="banner">
    <div class="container">
      <h1 class="logo-font">苹果社区</h1>
      <p>分享技术、想法和生活经验的中文社区。</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">
      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a class="nav-link active" href="">全部文章</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">前端</a>
            </li>
          </ul>
        </div>

        <div class="article-preview">
          <div class="article-meta">
            <span class="user-pic">J</span>
            <div class="info">
              <span class="author">小李</span>
              <span class="date">1月20日</span>
            </div>
          </div>
          <a href="/article/ru-he-xie-di-yi-pian-ji-shu-wen-zhang" class="preview-link">
            <h1>如何写好第一篇技术文章</h1>
            <p>把学习过程写下来，就是最好的开始。</p>
            <span>阅读全文...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline">技术</li>
              <li class="tag-default tag-pill tag-outline">学习</li>
            </ul>
          </a>
        </div>

        <div class="article-preview">
          <div class="article-meta">
            <span class="user-pic">A</span>
            <div class="info">
              <span class="author">阿明</span>
              <span class="date">1月20日</span>
            </div>
          </div>
          <a href="/article/wo-de-qian-duan-xue-xi-lu-xian" class="preview-link">
            <h1>我的前端学习路线</h1>
            <p>从 HTML、CSS 到 React，记录一条适合新手的路线。</p>
            <span>阅读全文...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline">前端</li>
              <li class="tag-default tag-pill tag-outline">React</li>
            </ul>
          </a>
        </div>

        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
          </li>
        </ul>
      </div>

      <div class="col-md-3">
        <div class="sidebar">
          <p>热门标签</p>

          <div class="tag-list">
            <a href="" class="tag-pill tag-default">技术</a>
            <a href="" class="tag-pill tag-default">前端</a>
            <a href="" class="tag-pill tag-default">React</a>
            <a href="" class="tag-pill tag-default">学习</a>
            <a href="" class="tag-pill tag-default">社区</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 创建/编辑文章

发表和编辑文章时只输入用户名即可。
```html
<div class="editor-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-10 offset-md-1 col-xs-12">
        <ul class="error-messages">
          <li>请填写文章标题</li>
        </ul>

        <form>
          <fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="用户名" />
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control form-control-lg" placeholder="文章标题" />
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="一句话介绍这篇文章" />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control"
                rows="8"
                placeholder="写下你的文章正文（支持 Markdown）"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="输入标签" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> 标签 </span>
              </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button">
              发布文章
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
```

### 文章

文章和评论的编辑、删除按钮对所有人显示。

```html
<div class="article-page">
  <div class="banner">
    <div class="container">
      <h1>如何写好第一篇技术文章</h1>

      <div class="article-meta">
        <span class="user-pic">J</span>
        <div class="info">
          <span class="author">小李</span>
          <span class="date">1月20日</span>
        </div>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> 编辑文章
        </button>
        <button class="btn btn-sm btn-outline-danger">
          <i class="ion-trash-a"></i> 删除文章
        </button>
      </div>
    </div>
  </div>

  <div class="container page">
    <div class="row article-content">
      <div class="col-md-12">
        <p>
          很多人觉得技术文章必须非常高级，其实不一定。
        </p>
        <h2 id="start-writing">从一个小问题开始写。</h2>
        <p>你可以记录一次踩坑、一个小工具，或者一段学习心得。</p>
        <ul class="tag-list">
          <li class="tag-default tag-pill tag-outline">技术</li>
          <li class="tag-default tag-pill tag-outline">学习</li>
        </ul>
      </div>
    </div>

    <hr />

    <div class="article-actions">
      <div class="article-meta">
        <span class="user-pic">J</span>
        <div class="info">
          <span class="author">小李</span>
          <span class="date">1月20日</span>
        </div>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> 编辑文章
        </button>
        <button class="btn btn-sm btn-outline-danger">
          <i class="ion-trash-a"></i> 删除文章
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form class="card comment-form">
          <div class="card-block">
            <input type="text" class="form-control" placeholder="用户名" />
            <textarea class="form-control" placeholder="写下你的评论..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <span class="comment-author-img">J</span>
            <button class="btn btn-sm btn-primary">发表评论</button>
          </div>
        </form>

        <div class="card">
          <div class="card-block">
            <p class="card-text">
              这个社区的规则很简单，适合新手练习。
            </p>
          </div>
          <div class="card-footer">
            <span class="comment-author-img">J</span>
            &nbsp;
            <span class="comment-author">小王</span>
            <span class="date-posted">12月29日</span>
            <span class="mod-options">
              <i class="ion-edit"></i>
              <i class="ion-trash-a"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```
