import type { FormEvent } from 'react';
import type { ArticleInput } from '../../api';
import { parseTags } from '../../utils/article';
import { TagList } from '../ui/TagList';

type ArticleEditorFormProps = {
  form: ArticleInput;
  tagInput: string;
  isEditing: boolean;
  onFieldChange: (field: keyof ArticleInput, value: string) => void;
  onTagInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/**
 * 只负责渲染文章表单。表单数据和提交逻辑仍由 EditorPage 管理，
 * 这样展示组件不需要知道 API 的细节。
 */
export function ArticleEditorForm({
  form,
  tagInput,
  isEditing,
  onFieldChange,
  onTagInputChange,
  onSubmit,
}: ArticleEditorFormProps) {
  return (
    <form className="editor-form" onSubmit={onSubmit}>
      <input
        className="form-control"
        placeholder="用户名"
        value={form.username}
        onChange={(event) => onFieldChange('username', event.target.value)}
      />
      <input
        className="form-control form-control-lg"
        placeholder="文章标题"
        value={form.title}
        onChange={(event) => onFieldChange('title', event.target.value)}
      />
      <input
        className="form-control"
        placeholder="一句话介绍这篇文章"
        value={form.description}
        onChange={(event) => onFieldChange('description', event.target.value)}
      />
      <textarea
        className="form-control"
        rows={9}
        placeholder="写下你的文章正文（支持 Markdown）"
        value={form.body}
        onChange={(event) => onFieldChange('body', event.target.value)}
      />
      <input
        className="form-control"
        placeholder="输入标签，用英文逗号分隔，例如：React, 前端"
        value={tagInput}
        onChange={(event) => onTagInputChange(event.target.value)}
      />
      <TagList tags={parseTags(tagInput)} />
      <button className="primary-button" type="submit">
        {isEditing ? '更新文章' : '发布文章'}
      </button>
    </form>
  );
}
