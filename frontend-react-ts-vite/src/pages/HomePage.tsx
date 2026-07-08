import { useEffect, useState } from 'react';
import type { Article } from '../api';
import { api } from '../api';
import { ArticlePreviewCard } from '../components/article/ArticlePreviewCard';
import { Pagination } from '../components/article/Pagination';
import { PopularTags } from '../components/article/PopularTags';
import type { Navigate } from '../types/navigation';

const PAGE_SIZE = 10;

type HomePageProps = {
  onNavigate: Navigate;
};

/** 首页负责请求文章与标签，并保存筛选、分页等页面级状态。 */
export function HomePage({ onNavigate }: HomePageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>();
  const [page, setPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 组件离开页面后，不再使用已经过期的请求结果更新状态。
    let isActive = true;

    Promise.all([
      api.listArticles({
        tag: selectedTag,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
      api.listTags(),
    ])
      .then(([articleResponse, tagResponse]) => {
        if (!isActive) return;
        setArticles(articleResponse.articles);
        setArticlesCount(articleResponse.articlesCount);
        setTags(tagResponse.tags);
        setErrorMessage('');
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setErrorMessage(
          error instanceof Error ? error.message : '文章加载失败，请稍后重试',
        );
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [page, selectedTag]);

  const selectTag = (tag?: string) => {
    setIsLoading(true);
    setSelectedTag(tag);
    setPage(1);
  };

  const changePage = (nextPage: number) => {
    setIsLoading(true);
    setPage(nextPage);
  };

  return (
    <main className="home-page">
      <section className="banner">
        <div className="container">
          <h1>简单论坛</h1>
          <p>分享技术、想法和生活经验的中文社区。</p>
        </div>
      </section>

      <section className="container page-grid">
        <div className="main-column">
          <div className="feed-toggle">
            <button
              className={!selectedTag ? 'tab active' : 'tab'}
              type="button"
              onClick={() => selectTag()}
            >
              全部文章
            </button>
            {selectedTag && (
              <button className="tab active" type="button">
                #{selectedTag}
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="empty-state">文章加载中...</p>
          ) : errorMessage ? (
            <p className="empty-state">{errorMessage}</p>
          ) : articles.length === 0 ? (
            <p className="empty-state">还没有文章，来发布第一篇吧。</p>
          ) : (
            articles.map((article) => (
              <ArticlePreviewCard
                article={article}
                key={article.slug}
                onOpen={() =>
                  onNavigate({ name: 'article', slug: article.slug })
                }
              />
            ))
          )}

          <Pagination
            currentPage={page}
            totalItems={articlesCount}
            pageSize={PAGE_SIZE}
            onChange={changePage}
          />
        </div>

        <PopularTags
          tags={tags}
          selectedTag={selectedTag}
          onSelect={selectTag}
        />
      </section>
    </main>
  );
}
