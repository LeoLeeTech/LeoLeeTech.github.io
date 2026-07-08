// 这个文件专门负责“和后端说话”。
// 初学者可以把它理解成：页面组件不直接写 fetch，而是统一调用这里的 api.xxx 方法。
// 这样以后后端地址、请求头、错误处理变化时，只需要改这一个文件。

export type Article = {
  slug: string
  title: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  username: string
}

export type Comment = {
  id: number
  createdAt: string
  updatedAt: string
  body: string
  username: string
}

// 创建/编辑文章时，前端表单需要提交给后端的数据。
export type ArticleInput = {
  username: string
  title: string
  body: string
  tagList: string[]
}

// 创建/编辑评论时，前端表单需要提交给后端的数据。
export type CommentInput = {
  username: string
  body: string
}

type ListArticlesParams = {
  tag?: string
  username?: string
  limit?: number
  offset?: number
}

// Vite 中，前端环境变量必须以 VITE_ 开头。
// 本地联调默认请求 Cloudflare Worker：npm run dev -- --port 8787
const API_BASE_URL = 'http://127.0.0.1:8787/api'

function buildQuery(params: ListArticlesParams) {
  const searchParams = new URLSearchParams()

  if (params.tag) searchParams.set('tag', params.tag)
  if (params.username) searchParams.set('username', params.username)
  if (params.limit) searchParams.set('limit', String(params.limit))
  if (params.offset) searchParams.set('offset', String(params.offset))

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

// 所有请求都会经过这个函数。
// 它做了三件事：
// 1. 拼接后端地址
// 2. 默认带上 JSON 请求头
// 3. 后端返回错误状态码时抛出异常
async function requestJson<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed: ${response.status}`)
  }

  // DELETE 接口通常返回 204 No Content，没有 JSON body。
  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}

export const api = {
  listArticles(params: ListArticlesParams = {}) {
    return requestJson<{ articles: Article[]; articlesCount: number }>(
      `/articles${buildQuery(params)}`,
    )
  },

  getArticle(slug: string) {
    return requestJson<{ article: Article }>(`/articles/${encodeURIComponent(slug)}`)
  },

  createArticle(input: ArticleInput) {
    return requestJson<{ article: Article }>('/articles', {
      method: 'POST',
      body: JSON.stringify({ article: input }),
    })
  },

  updateArticle(slug: string, input: ArticleInput) {
    return requestJson<{ article: Article }>(`/articles/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: JSON.stringify({ article: input }),
    })
  },

  async deleteArticle(slug: string) {
    await requestJson<void>(`/articles/${encodeURIComponent(slug)}`, { method: 'DELETE' })
  },

  listTags() {
    return requestJson<{ tags: string[] }>('/tags')
  },

  listComments(slug: string) {
    return requestJson<{ comments: Comment[] }>(
      `/articles/${encodeURIComponent(slug)}/comments`,
    )
  },

  createComment(slug: string, input: CommentInput) {
    return requestJson<{ comment: Comment }>(`/articles/${encodeURIComponent(slug)}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment: input }),
    })
  },

  updateComment(slug: string, id: number, input: CommentInput) {
    return requestJson<{ comment: Comment }>(
      `/articles/${encodeURIComponent(slug)}/comments/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ comment: input }),
      },
    )
  },

  async deleteComment(slug: string, id: number) {
    await requestJson<void>(`/articles/${encodeURIComponent(slug)}/comments/${id}`, {
      method: 'DELETE',
    })
  },
}
