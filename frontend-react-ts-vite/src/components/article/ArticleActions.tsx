import type { Article } from '../../api';
import { formatDate } from '../../utils/article';
import { Avatar } from '../ui/Avatar';

type ArticleActionsProps = {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
};

/** 文章作者信息和编辑、删除按钮，在详情页顶部与底部复用。 */
export function ArticleActions({
  article,
  onEdit,
  onDelete,
}: ArticleActionsProps) {
  return (
    <div className="article-meta">
      <Avatar username={article.username} />
      <div className="info">
        <span className="author">{article.username}</span>
        <span className="date">{formatDate(article.createdAt)}</span>
      </div>
      <button className="ghost-button" type="button" onClick={onEdit}>
        编辑文章
      </button>
      <button className="danger-button" type="button" onClick={onDelete}>
        删除文章
      </button>
    </div>
  );
}
