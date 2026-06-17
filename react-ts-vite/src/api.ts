export type Author = {
  username: string
  avatarInitial: string
}

export type Article = {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  author: Author
}

export type ArticlePreview = Omit<Article, 'body'>

export type Comment = {
  id: number
  createdAt: string
  updatedAt: string
  body: string
  author: Author
}

export type ArticleInput = {
  username: string
  title: string
  description: string
  body: string
  tagList: string[]
}

export type CommentInput = {
  username: string
  body: string
}

type ListArticlesParams = {
  tag?: string
  author?: string
  limit?: number
  offset?: number
}

const API_BASE_URL = '/api'
const USE_MOCK_API = true

const now = () => new Date().toISOString()

const avatarInitial = (username: string) =>
  username.trim().charAt(0).toUpperCase() || '?'

const toAuthor = (username: string): Author => ({
  username: username.trim(),
  avatarInitial: avatarInitial(username),
})

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || `article-${Date.now()}`

const uniqueSlug = (title: string, currentSlug?: string) => {
  const baseSlug = slugify(title)
  let slug = baseSlug
  let suffix = 2

  while (articles.some((article) => article.slug === slug && article.slug !== currentSlug)) {
    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return slug
}

let articles: Article[] = [
  {
    slug: 'how-to-build-webapps-that-scale',
    title: 'How to build webapps that scale',
    description: 'This is the description for the post.',
    body:
      'Web development technologies have evolved at an incredible clip over the past few years.\n\nSimple World keeps the core idea small: write articles, leave comments, and keep moving.',
    tagList: ['realworld', 'implementations'],
    createdAt: '2016-01-20T08:00:00.000Z',
    updatedAt: '2016-01-20T08:00:00.000Z',
    author: toAuthor('jake'),
  },
  {
    slug: 'the-song-you',
    title: "The song you won't ever stop singing. No matter how hard you try.",
    description: 'A short note about the kind of article title that begs to be clicked.',
    body:
      'This article is fake data, but the screen flow is real.\n\nWhen the backend is ready, the API layer already knows where to call.',
    tagList: ['react', 'vite'],
    createdAt: '2016-01-21T08:00:00.000Z',
    updatedAt: '2016-01-21T08:00:00.000Z',
    author: toAuthor('albert'),
  },
  {
    slug: 'simple-world-notes',
    title: 'Simple World notes',
    description: 'A tiny publishing app without accounts, passwords, or permission ceremony.',
    body:
      'Simple World only asks for a username when someone writes an article or comment.\n\nThe first letter becomes the avatar.',
    tagList: ['simple-world', 'react'],
    createdAt: '2016-01-22T08:00:00.000Z',
    updatedAt: '2016-01-22T08:00:00.000Z',
    author: toAuthor('leo'),
  },
]

const commentsBySlug: Record<string, Comment[]> = {
  'how-to-build-webapps-that-scale': [
    {
      id: 1,
      createdAt: '2016-01-23T08:00:00.000Z',
      updatedAt: '2016-01-23T08:00:00.000Z',
      body: 'This keeps the demo focused. I like it.',
      author: toAuthor('jacob'),
    },
  ],
  'the-song-you': [
    {
      id: 2,
      createdAt: '2016-01-24T08:00:00.000Z',
      updatedAt: '2016-01-24T08:00:00.000Z',
      body: 'No login wall, just write.',
      author: toAuthor('nora'),
    },
  ],
  'simple-world-notes': [],
}

let nextCommentId = 3

const wait = async () => new Promise((resolve) => window.setTimeout(resolve, 120))

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
    throw new Error(`Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return response.json() as Promise<TResponse>
}

export const api = {
  async listArticles(params: ListArticlesParams = {}) {
    if (!USE_MOCK_API) {
      const searchParams = new URLSearchParams()
      if (params.tag) searchParams.set('tag', params.tag)
      if (params.author) searchParams.set('author', params.author)
      if (params.limit) searchParams.set('limit', String(params.limit))
      if (params.offset) searchParams.set('offset', String(params.offset))
      const query = searchParams.toString()
      return requestJson<{ articles: ArticlePreview[]; articlesCount: number }>(
        `/articles${query ? `?${query}` : ''}`,
      )
    }

    await wait()
    const filteredArticles = articles.filter((article) => {
      const matchesTag = params.tag ? article.tagList.includes(params.tag) : true
      const matchesAuthor = params.author ? article.author.username === params.author : true
      return matchesTag && matchesAuthor
    })
    const offset = params.offset ?? 0
    const limit = params.limit ?? filteredArticles.length
    const pagedArticles = filteredArticles.slice(offset, offset + limit)

    return {
      articles: pagedArticles.map(({
        slug,
        title,
        description,
        tagList,
        createdAt,
        updatedAt,
        author,
      }) => ({
        slug,
        title,
        description,
        tagList,
        createdAt,
        updatedAt,
        author,
      })),
      articlesCount: filteredArticles.length,
    }
  },

  async getArticle(slug: string) {
    if (!USE_MOCK_API) {
      return requestJson<{ article: Article }>(`/articles/${slug}`)
    }

    await wait()
    const article = articles.find((item) => item.slug === slug)
    if (!article) {
      throw new Error('Article not found')
    }

    return { article }
  },

  async createArticle(input: ArticleInput) {
    if (!USE_MOCK_API) {
      return requestJson<{ article: Article }>('/articles', {
        method: 'POST',
        body: JSON.stringify({ article: input }),
      })
    }

    await wait()
    const timestamp = now()
    const article: Article = {
      slug: uniqueSlug(input.title),
      title: input.title.trim(),
      description: input.description.trim(),
      body: input.body.trim(),
      tagList: input.tagList,
      createdAt: timestamp,
      updatedAt: timestamp,
      author: toAuthor(input.username),
    }
    articles = [article, ...articles]
    commentsBySlug[article.slug] = []

    return { article }
  },

  async updateArticle(slug: string, input: ArticleInput) {
    if (!USE_MOCK_API) {
      return requestJson<{ article: Article }>(`/articles/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({ article: input }),
      })
    }

    await wait()
    const articleIndex = articles.findIndex((article) => article.slug === slug)
    if (articleIndex < 0) {
      throw new Error('Article not found')
    }

    const currentArticle = articles[articleIndex]
    const nextSlug = uniqueSlug(input.title, currentArticle.slug)
    const updatedArticle: Article = {
      ...currentArticle,
      slug: nextSlug,
      title: input.title.trim(),
      description: input.description.trim(),
      body: input.body.trim(),
      tagList: input.tagList,
      updatedAt: now(),
      author: toAuthor(input.username),
    }

    articles = articles.map((article) => (article.slug === slug ? updatedArticle : article))
    if (nextSlug !== slug) {
      commentsBySlug[nextSlug] = commentsBySlug[slug] ?? []
      delete commentsBySlug[slug]
    }

    return { article: updatedArticle }
  },

  async deleteArticle(slug: string) {
    if (!USE_MOCK_API) {
      await requestJson<void>(`/articles/${slug}`, { method: 'DELETE' })
      return
    }

    await wait()
    articles = articles.filter((article) => article.slug !== slug)
    delete commentsBySlug[slug]
  },

  async listTags() {
    if (!USE_MOCK_API) {
      return requestJson<{ tags: string[] }>('/tags')
    }

    await wait()
    const tags = Array.from(new Set(articles.flatMap((article) => article.tagList))).sort()
    return { tags }
  },

  async listComments(slug: string) {
    if (!USE_MOCK_API) {
      return requestJson<{ comments: Comment[] }>(`/articles/${slug}/comments`)
    }

    await wait()
    return { comments: commentsBySlug[slug] ?? [] }
  },

  async createComment(slug: string, input: CommentInput) {
    if (!USE_MOCK_API) {
      return requestJson<{ comment: Comment }>(`/articles/${slug}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment: input }),
      })
    }

    await wait()
    const timestamp = now()
    const comment: Comment = {
      id: nextCommentId,
      createdAt: timestamp,
      updatedAt: timestamp,
      body: input.body.trim(),
      author: toAuthor(input.username),
    }
    nextCommentId += 1
    commentsBySlug[slug] = [...(commentsBySlug[slug] ?? []), comment]

    return { comment }
  },

  async updateComment(slug: string, id: number, input: CommentInput) {
    if (!USE_MOCK_API) {
      return requestJson<{ comment: Comment }>(`/articles/${slug}/comments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ comment: input }),
      })
    }

    await wait()
    const comments = commentsBySlug[slug] ?? []
    let updatedComment: Comment | undefined
    commentsBySlug[slug] = comments.map((comment) => {
      if (comment.id !== id) return comment
      updatedComment = {
        ...comment,
        body: input.body.trim(),
        updatedAt: now(),
        author: toAuthor(input.username),
      }
      return updatedComment
    })

    if (!updatedComment) {
      throw new Error('Comment not found')
    }

    return { comment: updatedComment }
  },

  async deleteComment(slug: string, id: number) {
    if (!USE_MOCK_API) {
      await requestJson<void>(`/articles/${slug}/comments/${id}`, { method: 'DELETE' })
      return
    }

    await wait()
    commentsBySlug[slug] = (commentsBySlug[slug] ?? []).filter((comment) => comment.id !== id)
  },
}
