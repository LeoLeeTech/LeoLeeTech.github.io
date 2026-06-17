import type { ArticlePreview } from '../../api';
import { formatDate } from '../../utils/article';
import { Avatar } from '../ui/Avatar';
import { TagList } from '../ui/TagList';

type ArticlePreviewCardProps = {
  article: ArticlePreview;
  onOpen: () => void;
};

/** 首页中的单篇文章摘要卡片。点击正文区域时进入文章详情页。 */
export function ArticlePreviewCard({ article, onOpen }: ArticlePreviewCardProps) {
  return (
    <article className="article-preview">
      <div className="article-meta">
        <Avatar username={article.author.username} />
        <div className="info">
          <span className="author">{article.author.username}</span>
          <span className="date">{formatDate(article.createdAt)}</span>
        </div>
      </div>

      <button className="preview-link" type="button" onClick={onOpen}>
        <h2>{article.title}</h2>
        <p>{article.description}</p>
        <span className="read-more">阅读全文...</span>
        <TagList tags={article.tagList} outlined />
      </button>
    </article>
  );
}
