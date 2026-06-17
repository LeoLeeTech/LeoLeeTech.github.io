import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { api } from './api'
import type { Article, ArticleInput, ArticlePreview, Comment, CommentInput } from './api'
import './App.css'

// 这里没有使用 react-router，是为了让新手更容易看懂。
// route 就是当前“页面状态”：home 首页、editor 编辑页、article 文章详情页。
type Route =
  | { name: 'home' }
  | { name: 'editor'; slug?: string }
  | { name: 'article'; slug: string }

type ArticleFormState = ArticleInput
type CommentFormState = CommentInput

const emptyArticleForm: ArticleFormState = {
  username: '',
  title: '',
  description: '',
  body: '',
  tagList: [],
}

const emptyCommentForm: CommentFormState = {
  username: '',
  body: '',
}

// 后端给的是 ISO 时间字符串，这里统一格式化成可读日期。
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))

// 标签输入框中用逗号分隔，例如：react, workers, d1
const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

function Avatar({ username }: { username: string }) {
  // Simple World 没有上传头像功能，所以头像直接取用户名首字母大写。
  return <span className="avatar">{username.trim().charAt(0).toUpperCase() || '?'}</span>
}

function Header({
  route,
  onNavigate,
}: {
  route: Route
  onNavigate: (route: Route) => void
}) {
  // Header 只负责顶部导航，不负责请求数据。
  const isHome = route.name === 'home'
  const isEditor = route.name === 'editor'

  return (
    <nav className="navbar">
      <button className="brand" type="button" onClick={() => onNavigate({ name: 'home' })}>
        conduit
      </button>
      <div className="nav-links">
        <button
          className={isHome ? 'nav-link active' : 'nav-link'}
          type="button"
          onClick={() => onNavigate({ name: 'home' })}
        >
          Home
        </button>
        <button
          className={isEditor ? 'nav-link active' : 'nav-link'}
          type="button"
          onClick={() => onNavigate({ name: 'editor' })}
        >
          New Article
        </button>
      </div>
    </nav>
  )
}

function HomePage({
  onNavigate,
}: {
  onNavigate: (route: Route) => void
}) {
  const [articles, setArticles] = useState<ArticlePreview[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [articlesCount, setArticlesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const pageSize = 2

  useEffect(() => {
    // isActive 是一个小保护：如果组件卸载了，旧请求回来时就不要再 setState。
    let isActive = true

    Promise.all([
      api.listArticles({
        tag: selectedTag,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      api.listTags(),
    ])
      .then(([articleResponse, tagResponse]) => {
        if (!isActive) return
        setArticles(articleResponse.articles)
        setArticlesCount(articleResponse.articlesCount)
        setTags(tagResponse.tags)
        setErrorMessage('')
      })
      .catch((error) => {
        if (!isActive) return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load articles')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [page, selectedTag])

  // 后端返回 articlesCount，前端据此计算需要显示几个分页按钮。
  const visiblePages = useMemo(() => {
    const totalPages = Math.max(Math.ceil(articlesCount / pageSize), 1)
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }, [articlesCount])

  return (
    <main className="home-page">
      <section className="banner">
        <div className="container">
          <h1>conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </section>

      <section className="container page-grid">
        <div className="main-column">
          <div className="feed-toggle">
            <button
              className={!selectedTag ? 'tab active' : 'tab'}
              type="button"
              onClick={() => {
                setSelectedTag(undefined)
                setPage(1)
              }}
            >
              Global Feed
            </button>
            {selectedTag && <button className="tab active" type="button">#{selectedTag}</button>}
          </div>

          {isLoading ? (
            <p className="empty-state">Loading articles...</p>
          ) : errorMessage ? (
            <p className="empty-state">{errorMessage}</p>
          ) : articles.length === 0 ? (
            <p className="empty-state">No articles are here yet.</p>
          ) : (
            articles.map((article) => (
              <article className="article-preview" key={article.slug}>
                <div className="article-meta">
                  <Avatar username={article.author.username} />
                  <div className="info">
                    <span className="author">{article.author.username}</span>
                    <span className="date">{formatDate(article.createdAt)}</span>
                  </div>
                </div>

                <button
                  className="preview-link"
                  type="button"
                  onClick={() => onNavigate({ name: 'article', slug: article.slug })}
                >
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <span className="read-more">Read more...</span>
                  <ul className="tag-list">
                    {article.tagList.map((tag) => (
                      <li className="tag tag-outline" key={tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </button>
              </article>
            ))
          )}

          <div className="pagination">
            {visiblePages.map((pageNumber) => (
              <button
                className={page === pageNumber ? 'page-button active' : 'page-button'}
                type="button"
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <p>Popular Tags</p>
          <div className="tag-list sidebar-tags">
            {tags.map((tag) => (
              <button
                className={selectedTag === tag ? 'tag active' : 'tag'}
                type="button"
                key={tag}
                onClick={() => {
                  setSelectedTag(tag)
                  setPage(1)
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

function EditorPage({
  slug,
  onNavigate,
}: {
  slug?: string
  onNavigate: (route: Route) => void
}) {
  // 如果有 slug，说明是编辑已有文章；没有 slug，说明是新建文章。
  const [form, setForm] = useState<ArticleFormState>(emptyArticleForm)
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const isEditing = Boolean(slug)

  useEffect(() => {
    if (!slug) {
      return
    }

    // 编辑文章时，先从后端拉取原文章，再填充到表单里。
    api.getArticle(slug).then(({ article }) => {
      setForm({
        username: article.author.username,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
      })
      setTagInput(article.tagList.join(', '))
    })
  }, [slug])

  const updateForm = (field: keyof ArticleFormState, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const submitArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // 提交前做最基本的前端校验，避免空内容直接发给后端。
    const nextForm = { ...form, tagList: parseTags(tagInput) }
    const nextErrors = [
      !nextForm.username.trim() ? 'Username is required' : '',
      !nextForm.title.trim() ? 'Title is required' : '',
      !nextForm.description.trim() ? 'Description is required' : '',
      !nextForm.body.trim() ? 'Body is required' : '',
    ].filter(Boolean)

    if (nextErrors.length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors([])
    const response = isEditing && slug
      ? await api.updateArticle(slug, nextForm)
      : await api.createArticle(nextForm)
    onNavigate({ name: 'article', slug: response.article.slug })
  }

  return (
    <main className="editor-page container narrow">
      <h1>{isEditing ? 'Edit Article' : 'New Article'}</h1>
      <p className="page-note">Only a username is needed. The avatar is generated from its first letter.</p>

      {errors.length > 0 && (
        <ul className="error-messages">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <form className="editor-form" onSubmit={submitArticle}>
        <input
          className="form-control"
          placeholder="Username"
          value={form.username}
          onChange={(event) => updateForm('username', event.target.value)}
        />
        <input
          className="form-control form-control-lg"
          placeholder="Article Title"
          value={form.title}
          onChange={(event) => updateForm('title', event.target.value)}
        />
        <input
          className="form-control"
          placeholder="What's this article about?"
          value={form.description}
          onChange={(event) => updateForm('description', event.target.value)}
        />
        <textarea
          className="form-control"
          rows={9}
          placeholder="Write your article (in markdown)"
          value={form.body}
          onChange={(event) => updateForm('body', event.target.value)}
        />
        <input
          className="form-control"
          placeholder="Enter tags, separated by commas"
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
        />
        <div className="tag-list">
          {parseTags(tagInput).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <button className="primary-button" type="submit">
          {isEditing ? 'Update Article' : 'Publish Article'}
        </button>
      </form>
    </main>
  )
}

function ArticlePage({
  slug,
  onNavigate,
}: {
  slug: string
  onNavigate: (route: Route) => void
}) {
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentForm, setCommentForm] = useState<CommentFormState>(emptyCommentForm)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentForm, setEditingCommentForm] = useState<CommentFormState>(emptyCommentForm)

  // 文章详情和评论列表经常需要一起刷新，所以封装成一个函数复用。
  const refreshArticle = async () => {
    const [articleResponse, commentResponse] = await Promise.all([
      api.getArticle(slug),
      api.listComments(slug),
    ])
    setArticle(articleResponse.article)
    setComments(commentResponse.comments)
  }

  useEffect(() => {
    let isActive = true

    // 进入文章详情页时，同时请求文章内容和评论列表。
    Promise.all([
      api.getArticle(slug),
      api.listComments(slug),
    ]).then(([articleResponse, commentResponse]) => {
      if (!isActive) return
      setArticle(articleResponse.article)
      setComments(commentResponse.comments)
    })

    return () => {
      isActive = false
    }
  }, [slug])

  if (!article) {
    return <main className="container narrow empty-state">Loading article...</main>
  }

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!commentForm.username.trim() || !commentForm.body.trim()) return
    // 评论创建成功后，清空输入框并重新拉取评论列表。
    await api.createComment(article.slug, commentForm)
    setCommentForm(emptyCommentForm)
    await refreshArticle()
  }

  const submitCommentUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingCommentId || !editingCommentForm.username.trim() || !editingCommentForm.body.trim()) {
      return
    }
    await api.updateComment(article.slug, editingCommentId, editingCommentForm)
    setEditingCommentId(null)
    setEditingCommentForm(emptyCommentForm)
    await refreshArticle()
  }

  const deleteArticle = async () => {
    // Simple World 没有账号和权限系统，所以任何人都能删除文章。
    await api.deleteArticle(article.slug)
    onNavigate({ name: 'home' })
  }

  const deleteComment = async (commentId: number) => {
    await api.deleteComment(article.slug, commentId)
    await refreshArticle()
  }

  return (
    <main className="article-page">
      <section className="article-hero">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleActions
            article={article}
            onEdit={() => onNavigate({ name: 'editor', slug: article.slug })}
            onDelete={deleteArticle}
          />
        </div>
      </section>

      <section className="container narrow">
        <div className="article-body">
          {article.body.split('\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="tag-list">
            {article.tagList.map((tag) => (
              <li className="tag tag-outline" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <ArticleActions
          article={article}
          onEdit={() => onNavigate({ name: 'editor', slug: article.slug })}
          onDelete={deleteArticle}
        />

        <form className="comment-form" onSubmit={submitComment}>
          <div className="comment-fields">
            <input
              className="form-control"
              placeholder="Username"
              value={commentForm.username}
              onChange={(event) =>
                setCommentForm((currentForm) => ({
                  ...currentForm,
                  username: event.target.value,
                }))
              }
            />
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              rows={3}
              value={commentForm.body}
              onChange={(event) =>
                setCommentForm((currentForm) => ({ ...currentForm, body: event.target.value }))
              }
            />
          </div>
          <div className="comment-footer">
            <Avatar username={commentForm.username || 'J'} />
            <button className="primary-button small" type="submit">
              Post Comment
            </button>
          </div>
        </form>

        <div className="comments">
          {comments.map((comment) => (
            <article className="comment-card" key={comment.id}>
              {editingCommentId === comment.id ? (
                <form className="comment-edit-form" onSubmit={submitCommentUpdate}>
                  <input
                    className="form-control"
                    placeholder="Username"
                    value={editingCommentForm.username}
                    onChange={(event) =>
                      setEditingCommentForm((currentForm) => ({
                        ...currentForm,
                        username: event.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editingCommentForm.body}
                    onChange={(event) =>
                      setEditingCommentForm((currentForm) => ({
                        ...currentForm,
                        body: event.target.value,
                      }))
                    }
                  />
                  <div className="inline-actions">
                    <button className="primary-button small" type="submit">
                      Save
                    </button>
                    <button
                      className="ghost-button small"
                      type="button"
                      onClick={() => setEditingCommentId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p>{comment.body}</p>
                  <footer className="comment-meta">
                    <Avatar username={comment.author.username} />
                    <span className="author">{comment.author.username}</span>
                    <span className="date">{formatDate(comment.createdAt)}</span>
                    <span className="mod-options">
                      <button
                        className="icon-button"
                        type="button"
                        aria-label="Edit comment"
                        onClick={() => {
                          setEditingCommentId(comment.id)
                          setEditingCommentForm({
                            username: comment.author.username,
                            body: comment.body,
                          })
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        aria-label="Delete comment"
                        onClick={() => deleteComment(comment.id)}
                      >
                        ×
                      </button>
                    </span>
                  </footer>
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function ArticleActions({
  article,
  onEdit,
  onDelete,
}: {
  article: Article
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="article-meta">
      <Avatar username={article.author.username} />
      <div className="info">
        <span className="author">{article.author.username}</span>
        <span className="date">{formatDate(article.createdAt)}</span>
      </div>
      <button className="ghost-button" type="button" onClick={onEdit}>
        Edit Article
      </button>
      <button className="danger-button" type="button" onClick={onDelete}>
        Delete Article
      </button>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' })

  return (
    <>
      <Header route={route} onNavigate={setRoute} />
      {route.name === 'home' && <HomePage onNavigate={setRoute} />}
      {route.name === 'editor' && (
        <EditorPage key={route.slug ?? 'new-article'} slug={route.slug} onNavigate={setRoute} />
      )}
      {route.name === 'article' && (
        <ArticlePage key={route.slug} slug={route.slug} onNavigate={setRoute} />
      )}
      <footer className="site-footer">
        <span className="footer-brand">conduit</span>
        <span>Simple World frontend. Fake data today, API tomorrow.</span>
      </footer>
    </>
  )
}

export default App
