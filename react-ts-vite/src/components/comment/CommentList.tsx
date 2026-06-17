import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Comment, CommentInput } from '../../api';
import { CommentCard } from './CommentCard';

const emptyEditForm: CommentInput = { username: '', body: '' };

type CommentListProps = {
  comments: Comment[];
  onUpdate: (id: number, input: CommentInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

/** 评论列表统一记录“当前正在编辑哪条评论”，确保一次只编辑一条。 */
export function CommentList({ comments, onUpdate, onDelete }: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CommentInput>(emptyEditForm);

  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditForm({ username: comment.author.username, body: comment.body });
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditForm(emptyEditForm);
  };

  const saveComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCommentId || !editForm.username.trim() || !editForm.body.trim()) {
      return;
    }

    await onUpdate(editingCommentId, editForm);
    cancelEdit();
  };

  return (
    <div className="comments">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          isEditing={editingCommentId === comment.id}
          editForm={editForm}
          onStartEdit={() => startEdit(comment)}
          onCancelEdit={cancelEdit}
          onEditFormChange={setEditForm}
          onSave={saveComment}
          onDelete={() => onDelete(comment.id)}
        />
      ))}
    </div>
  );
}
