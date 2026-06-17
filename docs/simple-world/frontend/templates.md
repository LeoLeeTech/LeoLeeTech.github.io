---
title: 模板
sidebar_position: 1
---

## Head 元素

`<head>` 元素包含页面元数据（标题、描述）并加载样式表。

加载共享的 [Conduit 主题](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css)，以及它依赖的字体和图标。`styles.css` **不**内置字体或图标，所以下方 head 会同时加载这三类资源；详情见[样式](/docs/simple-world/frontend/styles/)页面。

```html
<head>
  <meta charset="utf-8" />
  <title>Conduit</title>
  <!-- Icons: the ion-* classes used in the templates below (legacy Ionicons v2) -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"
  />
  <!-- Fonts the theme uses -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700|Lora:400,700"
  />
  <!-- The shared Conduit theme (serve styles.css from your own app) -->
  <link rel="stylesheet" href="/styles.css" />
</head>
```

## 布局

### 页头

Simple World 只保留首页和新建文章入口。

```html
<nav class="navbar navbar-light">
  <div class="container">
    <a class="navbar-brand" href="/">conduit</a>
    <ul class="nav navbar-nav pull-xs-right">
      <li class="nav-item">
        <!-- Add "active" class when you're on that page" -->
        <a class="nav-link active" href="/">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/editor"> <i class="ion-compose"></i>&nbsp;New Article </a>
      </li>
    </ul>
  </div>
</nav>
```

### 页脚

```html
<footer>
  <div class="container">
    <a href="/" class="logo-font">conduit</a>
    <span class="attribution">
      An interactive learning project. Code &amp; design licensed under MIT.
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
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">
      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a class="nav-link active" href="">Global Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">AngularJS</a>
            </li>
          </ul>
        </div>

        <div class="article-preview">
          <div class="article-meta">
            <span class="user-pic">J</span>
            <div class="info">
              <span class="author">jake</span>
              <span class="date">January 20th</span>
            </div>
          </div>
          <a href="/article/how-to-build-webapps-that-scale" class="preview-link">
            <h1>How to build webapps that scale</h1>
            <p>This is the description for the post.</p>
            <span>Read more...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline">realworld</li>
              <li class="tag-default tag-pill tag-outline">implementations</li>
            </ul>
          </a>
        </div>

        <div class="article-preview">
          <div class="article-meta">
            <span class="user-pic">A</span>
            <div class="info">
              <span class="author">albert</span>
              <span class="date">January 20th</span>
            </div>
          </div>
          <a href="/article/the-song-you" class="preview-link">
            <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
            <p>This is the description for the post.</p>
            <span>Read more...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline">realworld</li>
              <li class="tag-default tag-pill tag-outline">implementations</li>
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
          <p>Popular Tags</p>

          <div class="tag-list">
            <a href="" class="tag-pill tag-default">programming</a>
            <a href="" class="tag-pill tag-default">javascript</a>
            <a href="" class="tag-pill tag-default">angularjs</a>
            <a href="" class="tag-pill tag-default">react</a>
            <a href="" class="tag-pill tag-default">node</a>
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
          <li>That title is required</li>
        </ul>

        <form>
          <fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="Username" />
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control form-control-lg" placeholder="Article Title" />
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="What's this article about?" />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control"
                rows="8"
                placeholder="Write your article (in markdown)"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="Enter tags" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> tag </span>
              </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button">
              Publish Article
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
      <h1>How to build webapps that scale</h1>

      <div class="article-meta">
        <span class="user-pic">J</span>
        <div class="info">
          <span class="author">jake</span>
          <span class="date">January 20th</span>
        </div>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> Edit Article
        </button>
        <button class="btn btn-sm btn-outline-danger">
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </div>
    </div>
  </div>

  <div class="container page">
    <div class="row article-content">
      <div class="col-md-12">
        <p>
          Web development technologies have evolved at an incredible clip over the past few years.
        </p>
        <h2 id="introducing-ionic">Introducing RealWorld.</h2>
        <p>It's a great solution for learning how other frameworks work.</p>
        <ul class="tag-list">
          <li class="tag-default tag-pill tag-outline">realworld</li>
          <li class="tag-default tag-pill tag-outline">implementations</li>
        </ul>
      </div>
    </div>

    <hr />

    <div class="article-actions">
      <div class="article-meta">
        <span class="user-pic">J</span>
        <div class="info">
          <span class="author">jake</span>
          <span class="date">January 20th</span>
        </div>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> Edit Article
        </button>
        <button class="btn btn-sm btn-outline-danger">
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <form class="card comment-form">
          <div class="card-block">
            <input type="text" class="form-control" placeholder="Username" />
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <span class="comment-author-img">J</span>
            <button class="btn btn-sm btn-primary">Post Comment</button>
          </div>
        </form>

        <div class="card">
          <div class="card-block">
            <p class="card-text">
              With supporting text below as a natural lead-in to additional content.
            </p>
          </div>
          <div class="card-footer">
            <span class="comment-author-img">J</span>
            &nbsp;
            <span class="comment-author">jacob</span>
            <span class="date-posted">Dec 29th</span>
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
