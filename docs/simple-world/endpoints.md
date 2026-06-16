---
title: 接口规范
sidebar_position: 2
---



## 文章

### 文章列表

- 接口: `GET /api/articles`

- 作用: 默认返回全站最新文章

- 查询参数:

  | 功能说明       | 查询参数    | 示例              |
  | -------------- | ----------- | ----------------- |
  | 按标签过滤     | `tag`       | `?tag=AngularJS`  |
  | 按作者过滤     | `author`    | `?author=jake`    |
  | 按收藏用户过滤 | `favorited` | `?favorited=jake` |
  | 限制返回数量   | `limit`     | `?limit=20`       |
  | 偏移/跳过数量  | `offset`    | `?offset=0`       |

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
          "username": "jake",
          "image": "https://i.stack.imgur.com/xHWG8.jpg"
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
          "username": "jake",
          "image": "https://i.stack.imgur.com/xHWG8.jpg"
        }
      }
    ],
    "articlesCount": 2
  }
  ```

### 获取文章

- 接口: `GET /api/articles/:slug`

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
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "jake",
        "bio": "I work at statefarm",
        "image": "https://i.stack.imgur.com/xHWG8.jpg",
        "following": false
      }
    }
  }
  ```

### 创建文章

- 接口: `POST /api/articles`

- 作用: 创建一篇新文章

- 必填字段: `title`、`description`、`body`

- 可选字段: `tagList`，字符串数组

- 请求体:

  ```json
  {
    "article": {
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
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "jake",
        "bio": "I work at statefarm",
        "image": "https://i.stack.imgur.com/xHWG8.jpg",
        "following": false
      }
    }
  }
  ```

### 更新文章

- 接口: `PUT /api/articles/:slug`

- 作用: 根据文章 `slug` 更新文章内容

- 路径参数:

  | 功能说明      | 路径参数 | 示例                        |
  | ------------- | -------- | --------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug` |

- 可选字段: `title`、`description`、`body`

- 特殊说明: 当 `title` 变化时，`slug` 也会更新。`slug` 是文章的 URL 标识符，必须唯一；具体生成方式由实现自行决定，测试套件不强制要求特定格式。

- 请求体:

  ```json
  {
    "article": {
      "title": "Did you train your dragon?"
    }
  }
  ```

- 响应体: 同“创建文章”接口

### 删除文章

- 接口: `DELETE /api/articles/:slug`
- 作用: 根据文章 `slug` 删除文章
- 认证: 需要
- 路径参数:

  | 功能说明      | 路径参数 | 示例                        |
  | ------------- | -------- | --------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug` |

- 响应体: 无

## 评论

### 给文章添加评论

- 接口: `POST /api/articles/:slug/comments`

- 作用: 给指定文章添加一条评论

- 路径参数:

  | 功能说明      | 路径参数 | 示例                                 |
  | ------------- | -------- | ------------------------------------ |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug/comments` |

- 必填字段: `body`

- 请求体:

  ```json
  {
    "comment": {
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
      "body": "It takes a Jacobian",
      "author": {
        "username": "jake",
        "image": "https://i.stack.imgur.com/xHWG8.jpg",
      }
    }
  }
  ```

### 获取文章评论

- 接口: `GET /api/articles/:slug/comments`

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
        "body": "It takes a Jacobian",
        "author": {
          "username": "jake",
          "image": "https://i.stack.imgur.com/xHWG8.jpg",
        }
      }
    ]
  }
  ```

### 删除评论

- 接口: `DELETE /api/articles/:slug/comments/:id`

- 作用: 删除指定文章下的一条评论

- 路径参数:

  | 功能说明      | 路径参数 | 示例                                     |
  | ------------- | -------- | ---------------------------------------- |
  | 文章 URL 标识 | `slug`   | `/api/articles/article-slug/comments/1`   |
  | 评论 ID       | `id`     | `/api/articles/article-slug/comments/1`   |

- 响应体: 无

## 标签

### 获取标签

- 接口: `GET /api/tags`

- 作用: 获取所有可用标签

- 响应体:

  ```json
  {
    "tags": ["reactjs", "angularjs"]
  }
  ```



使用 JSON 作为前后端交互的数据结构，例如 `Content-Type: application/json; charset=utf-8`。
