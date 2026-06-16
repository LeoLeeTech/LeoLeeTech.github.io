---
title: 路由
sidebar_position: 3
---

- 首页（URL：`/`）
  - 标签列表
  - 从关注流、全局列表或指定标签拉取的文章列表
  - 文章列表分页
- 登录/注册页面（URL：`/login`、`/register`）
  - 使用 JWT（将 token 存储在 localStorage 中）
  - 认证方式可以很容易切换为基于 session/cookie 的方案
- 设置页面（URL：`/settings`）
- 创建/编辑文章的编辑器页面（URL：`/editor`、`/editor/article-slug-here`）
- 文章页面（URL：`/article/article-slug-here`）
  - 删除文章按钮（仅对文章作者显示）
  - 在客户端渲染服务器返回的 markdown
  - 页面底部的评论区域
  - 删除评论按钮（仅对评论作者显示）
- 个人资料页面（URL：`/profile/:username`、`/profile/:username/favorites`）
  - 展示用户基础信息
  - 文章列表来自作者创建的文章或作者收藏的文章
