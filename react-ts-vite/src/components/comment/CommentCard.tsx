import type { FormEvent } from 'react';
import type { Comment, CommentInput } from '../../api';
import { formatDate } from '../../utils/article';
import { Avatar } from '../ui/Avatar';

type CommentCardProps = {
  comment: Comment;
  isEditing: boolean;
  editForm: CommentInput;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onEditFormChange: (form: CommentInput) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
};

/**
 * 单条评论同时包含“阅读状态”和“编辑状态”。
 * 是否进入编辑状态由父组件 CommentList 统一管理。
 */
export function CommentCard({
  comment,
  isEditing,
  editForm,
  onStartEdit,
  onCancelEdit,
  onEditFormChange,
  onSave,
  onDelete,
}: CommentCardProps) {
  return (
    <article className="comment-card">
      {isEditing ? (
        <form className="comment-edit-form" onSubmit={onSave}>
          <input
            className="form-control"
            placeholder="用户名"
            value={editForm.username}
            onChange={(event) =>
              onEditFormChange({ ...editForm, username: event.target.value })
            }
          />
          <textarea
            className="form-control"
            rows={3}
            value={editForm.body}
            onChange={(event) =>
              onEditFormChange({ ...editForm, body: event.target.value })
            }
          />
          <div className="inline-actions">
            <button className="primary-button small" type="submit">
              保存
            </button>
            <button
              className="ghost-button small"
              type="button"
              onClick={onCancelEdit}
            >
              取消
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
                aria-label="编辑评论"
                onClick={onStartEdit}
              >
                ✎
              </button>
              <button
                className="icon-button danger"
                type="button"
                aria-label="删除评论"
                onClick={onDelete}
              >
                ×
              </button>
            </span>
          </footer>
        </>
      )}
    </article>
  );
}
