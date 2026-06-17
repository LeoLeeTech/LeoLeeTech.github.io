---
title: 接口规范
sidebar_position: 2
---

使用 JSON 作为前后端交互的数据结构，例如 `Content-Type: application/json; charset=utf-8`。

Simple World 不包含账号系统。发表文章和评论时只需要输入一个用户名，头像由用户名首字母大写生成。

## 文章

### 文章列表

- URL: `/api/articles`
- 请求方式: `GET`
- 作用: 默认返回全站最新文章
- 查询参数:

  | 功能说明      | 查询参数 | 示例             |
  | ------------- | -------- | ---------------- |
  | 按标签过滤    | `tag`    | `?tag=AngularJS` |
  | 按作者过滤    | `author` | `?author=jake`    |
  | 限制返回数量  | `limit`  | `?limit=20`      |
  | 偏移/跳过数量 | `offset` | `?offset=0`      |

- 响应体:

  ```json
  {
    "articles": [
      {
        "slug": "how-to-train-your-dragon",
        "title": "How to train your dragon",
        "description": "Ever wonder how?",
        "tagList": ["dragons", "training"],
        "createdAt": "2016-02-18T03:22:56.637Z",
        "updatedAt": "2016-02-18T03:48:35.824Z",
        "author": {
          "username": "jake"
        }
      },
      {
        "slug": "how-to-train-your-dragon-2",
        "title": "How to train your dragon 2",
        "description": "So toothless",
        "tagList": ["dragons", "training"],
        "createdAt": "2016-02-18T03:22:56.637Z",
        "updatedAt": "2016-02-18T03:48:35.824Z",
        "author": {
          "username": "albert"
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
      "slug": "how-to-train-your-dragon",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "It takes a Jacobian",
      "tagList": ["dragons", "training"],
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:48:35.824Z",
      "author": {
        "username": "jake"
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
      "username": "jake",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "You have to believe",
      "tagList": ["reactjs", "angularjs", "dragons"]
    }
  }
  ```

- 响应体:

  ```json
  {
    "article": {
      "slug": "how-to-train-your-dragon",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "It takes a Jacobian",
      "tagList": ["dragons", "training"],
      "createdAt": "2016-02-18T03:22:56.637Z",
      "updatedAt": "2016-02-18T03:48:35.824Z",
      "author": {
        "username": "jake"
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
      "username": "jake",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "You have to believe",
      "tagList": ["reactjs", "angularjs", "dragons"]
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
      "username": "jacob",
      "body": "His name was my name too."
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
      "body": "His name was my name too.",
      "author": {
        "username": "jacob"
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
        "body": "His name was my name too.",
        "author": {
          "username": "jacob"
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
      "username": "jacob",
      "body": "Updated comment body."
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
    "tags": ["reactjs", "angularjs"]
  }
  ```
