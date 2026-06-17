import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api';
import type { Article, Comment, CommentInput } from '../api';
import { ArticleActions } from '../components/article/ArticleActions';
import { CommentComposer } from '../components/comment/CommentComposer';
import { CommentList } from '../components/comment/CommentList';
import { TagList } from '../components/ui/TagList';
import type { Navigate } from '../types/navigation';

const emptyCommentForm: CommentInput = { username: '', body: '' };

type ArticlePageProps = {
  slug: string;
  onNavigate: Navigate;
};

/** 文章详情页负责文章、评论数据，以及与后端交互的增删改操作。 */
export function ArticlePage({ slug, onNavigate }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] =
    useState<CommentInput>(emptyCommentForm);

  const refreshArticle = async () => {
    const [articleResponse, commentResponse] = await Promise.all([
      api.getArticle(slug),
      api.listComments(slug),
    ]);
    setArticle(articleResponse.article);
    setComments(commentResponse.comments);
  };

  useEffect(() => {
    // 初次进入详情页时，同时加载文章与评论，减少等待时间。
    let isActive = true;

    Promise.all([api.getArticle(slug), api.listComments(slug)]).then(
      ([articleResponse, commentResponse]) => {
        if (!isActive) return;
        setArticle(articleResponse.article);
        setComments(commentResponse.comments);
      },
    );

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (!article) {
    return <main className="container narrow empty-state">文章加载中...</main>;
  }

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!commentForm.username.trim() || !commentForm.body.trim()) return;

    await api.createComment(article.slug, commentForm);
    setCommentForm(emptyCommentForm);
    await refreshArticle();
  };

  const updateComment = async (id: number, input: CommentInput) => {
    await api.updateComment(article.slug, id, input);
    await refreshArticle();
  };

  const deleteComment = async (id: number) => {
    await api.deleteComment(article.slug, id);
    await refreshArticle();
  };

  const deleteArticle = async () => {
    // 这个教学项目没有账号与权限系统，因此任何访客都能删除文章。
    await api.deleteArticle(article.slug);
    onNavigate({ name: 'home' });
  };

  const editArticle = () => {
    onNavigate({ name: 'editor', slug: article.slug });
  };

  return (
    <main className="article-page">
      <section className="article-hero">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleActions
            article={article}
            onEdit={editArticle}
            onDelete={deleteArticle}
          />
        </div>
      </section>

      <section className="container narrow">
        <div className="article-body">
          {article.body.split('\n').map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
          <TagList tags={article.tagList} outlined />
        </div>

        <ArticleActions
          article={article}
          onEdit={editArticle}
          onDelete={deleteArticle}
        />

        <CommentComposer
          form={commentForm}
          onChange={setCommentForm}
          onSubmit={submitComment}
        />
        <CommentList
          comments={comments}
          onUpdate={updateComment}
          onDelete={deleteComment}
        />
      </section>
    </main>
  );
}
