import type { FormEvent } from 'react';
import type { CommentInput } from '../../api';
import { Avatar } from '../ui/Avatar';

type CommentComposerProps = {
  form: CommentInput;
  onChange: (form: CommentInput) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/** 新评论输入框。用户名变化时，下方头像也会同步变化。 */
export function CommentComposer({
  form,
  onChange,
  onSubmit,
}: CommentComposerProps) {
  return (
    <form className="comment-form" onSubmit={onSubmit}>
      <div className="comment-fields">
        <input
          className="form-control"
          placeholder="用户名"
          value={form.username}
          onChange={(event) => onChange({ ...form, username: event.target.value })}
        />
        <textarea
          className="form-control"
          placeholder="写下你的评论..."
          rows={3}
          value={form.body}
          onChange={(event) => onChange({ ...form, body: event.target.value })}
        />
      </div>
      <div className="comment-footer">
        <Avatar username={form.username || '访客'} />
        <button className="primary-button small" type="submit">
          发表评论
        </button>
      </div>
    </form>
  );
}
