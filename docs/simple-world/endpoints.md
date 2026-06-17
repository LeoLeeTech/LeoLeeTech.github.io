---
title: 接口规范
sidebar_position: 2
---

使用 JSON 作为前后端交互的数据结构，例如 `Content-Type: application/json; charset=utf-8`。

苹果社区不包含账号系统。发表文章和评论时只需要输入一个用户名，头像由用户名首字母大写生成。

## 文章

### 文章列表

- URL: `/api/articles`
- 请求方式: `GET`
- 作用: 默认返回全站最新文章
- 查询参数:

  | 功能说明      | 查询参数 | 示例             |
  | ------------- | -------- | ---------------- |
  | 按标签过滤    | `tag`    | `?tag=前端`      |
  | 按作者过滤    | `author` | `?author=小李`   |
  | 限制返回数量  | `limit`  | `?limit=20`      |
  | 偏移/跳过数量 | `offset` | `?offset=0`      |

- 响应体:

  ```json
  {
    "articles": [
      {
        "slug": "ru-he-xie-di-yi-pian-ji-shu-wen-zhang",
        "title": "如何写好第一篇技术文章",
        "description": "把学习过程写下来，就是最好的开始。",
        "tagList": ["技术", "学习"],
        "createdAt": "2016-02-18T03:22:56.637Z",
        "updatedAt": "2016-02-18T03:48:35.824Z",
        "author": {
          "username": "小李"
        }
      },
      {
        "slug": "wo-de-qian-duan-xue-xi-lu-xian",
        "title": "我的前端学习路线",
        "description": "从 HTML、CSS 到 React，记录一条适合新手的路线。",
        "tagList": ["前端", "React", "学习"],
        "createdAt": "2016-02-18T03:22:56.637Z",
        "updatedAt": "2016-02-18T03:48:35.824Z",
        "author": {
          "username": "阿明"
        }
      }
    ],
    "articlesCount": 2
  }
  ```

### 获取文章

- URL: `/api/articles/:slug`
- 请求方式: `GET`
- 作用: 根据文章 `slug` 获取单篇文章详情
- 路径参数:

  | 功能说明      | 路径参数 | 示例                        |
  | ------------- | -------- | --------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug` |

- 响应体:

  ```json
  {
    "article": {
      "slug": "ru-he-xie-di-yi-pian-ji-shu-wen-zhang",
      "title": "如何写好第一篇技术文章",
      "description": "把学习过程写下来，就是最好的开始。",
      "body": "你可以先从一次踩坑、一个小工具、一个读书笔记开始。",
      "tagList": ["技术", "学习"],
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:48:35.824Z",
      "author": {
        "username": "小李"
      }
    }
  }
  ```

### 创建文章

- URL: `/api/articles`
- 请求方式: `POST`
- 作用: 创建一篇新文章
- 必填字段: `username`、`title`、`description`、`body`
- 可选字段: `tagList`，字符串数组
- 请求体:

  ```json
  {
    "article": {
      "username": "小李",
      "title": "如何写好第一篇技术文章",
      "description": "把学习过程写下来，就是最好的开始。",
      "body": "你可以先从一次踩坑、一个小工具、一个读书笔记开始。",
      "tagList": ["技术", "学习"]
    }
  }
  ```

- 响应体:

  ```json
  {
    "article": {
      "slug": "ru-he-xie-di-yi-pian-ji-shu-wen-zhang",
      "title": "如何写好第一篇技术文章",
      "description": "把学习过程写下来，就是最好的开始。",
      "body": "你可以先从一次踩坑、一个小工具、一个读书笔记开始。",
      "tagList": ["技术", "学习"],
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:48:35.824Z",
      "author": {
        "username": "小李"
      }
    }
  }
  ```

### 更新文章

- URL: `/api/articles/:slug`
- 请求方式: `PUT`
- 作用: 根据文章 `slug` 更新文章内容
- 路径参数:

  | 功能说明      | 路径参数 | 示例                        |
  | ------------- | -------- | --------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug` |

- 可选字段: `username`、`title`、`description`、`body`、`tagList`
- 特殊说明: 当 `title` 变化时，`slug` 也会更新。`slug` 是文章的 URL 标识符，必须唯一；具体生成方式由实现自行决定。
- 请求体:

  ```json
  {
    "article": {
      "username": "小李",
      "title": "如何写好第一篇技术文章",
      "description": "把学习过程写下来，就是最好的开始。",
      "body": "你可以先从一次踩坑、一个小工具、一个读书笔记开始。",
      "tagList": ["技术", "学习"]
    }
  }
  ```

- 响应体: 同“创建文章”接口

### 删除文章

- URL: `/api/articles/:slug`
- 请求方式: `DELETE`
- 作用: 根据文章 `slug` 删除文章
- 路径参数:

  | 功能说明      | 路径参数 | 示例                        |
  | ------------- | -------- | --------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug` |

- 响应体: 无

## 评论

### 给文章添加评论

- URL: `/api/articles/:slug/comments`
- 请求方式: `POST`
- 作用: 给指定文章添加一条评论
- 路径参数:

  | 功能说明      | 路径参数 | 示例                                 |
  | ------------- | -------- | ------------------------------------ |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug/comments` |

- 必填字段: `username`、`body`
- 请求体:

  ```json
  {
    "comment": {
      "username": "小王",
      "body": "这个社区的规则很简单，适合新手练习。"
    }
  }
  ```

- 响应体:

  ```json
  {
    "comment": {
      "id": 1,
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:22:56.637Z",
      "body": "这个社区的规则很简单，适合新手练习。",
      "author": {
        "username": "小王"
      }
    }
  }
  ```

### 获取文章评论

- URL: `/api/articles/:slug/comments`
- 请求方式: `GET`
- 作用: 获取指定文章下的评论列表
- 路径参数:

  | 功能说明      | 路径参数 | 示例                                 |
  | ------------- | -------- | ------------------------------------ |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug/comments` |

- 响应体:

  ```json
  {
    "comments": [
      {
        "id": 1,
        "createdAt": "2016-02-18T03:22:56.637Z",
        "updatedAt": "2016-02-18T03:22:56.637Z",
        "body": "这个社区的规则很简单，适合新手练习。",
        "author": {
          "username": "小王"
        }
      }
    ]
  }
  ```


### 更新评论

- URL: `/api/articles/:slug/comments/:id`
- 请求方式: `PUT`
- 作用: 更新指定文章下的一条评论
- 路径参数:

  | 功能说明      | 路径参数 | 示例                                   |
  | ------------- | -------- | -------------------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug/comments/1` |
  | 评论 ID       | `id`     | `/api/articles/article-slug/comments/1` |

- 必填字段: `username`、`body`
- 请求体:

  ```json
  {
    "comment": {
      "username": "小王",
      "body": "我更新了一下评论内容。"
    }
  }
  ```

- 响应体: 同“给文章添加评论”接口

### 删除评论

- URL: `/api/articles/:slug/comments/:id`
- 请求方式: `DELETE`
- 作用: 删除指定文章下的一条评论
- 路径参数:

  | 功能说明      | 路径参数 | 示例                                   |
  | ------------- | -------- | -------------------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug/comments/1` |
  | 评论 ID       | `id`     | `/api/articles/article-slug/comments/1` |

- 响应体: 无

## 标签

### 获取标签

- URL: `/api/tags`
- 请求方式: `GET`
- 作用: 获取所有可用标签
- 响应体:

  ```json
  {
    "tags": ["技术", "前端", "学习"]
  }
  ```
