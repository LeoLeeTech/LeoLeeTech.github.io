import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { ArticleInput } from '../api';
import { api } from '../api';
import { ArticleEditorForm } from '../components/article/ArticleEditorForm';
import type { Navigate } from '../types/navigation';
import { parseTags } from '../utils/article';

const emptyArticleForm: ArticleInput = {
  username: '',
  title: '',
  description: '',
  body: '',
  tagList: [],
};

type EditorPageProps = {
  slug?: string;
  onNavigate: Navigate;
};

/** 新建和编辑文章共用一个页面；有没有 slug 决定当前是哪种模式。 */
export function EditorPage({ slug, onNavigate }: EditorPageProps) {
  const [form, setForm] = useState<ArticleInput>(emptyArticleForm);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const isEditing = Boolean(slug);

  useEffect(() => {
    if (!slug) return;

    // 编辑已有文章时，先读取文章，再把内容填入表单。
    api.getArticle(slug).then(({ article }) => {
      setForm({
        username: article.author.username,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
      });
      setTagInput(article.tagList.join(', '));
    });
  }, [slug]);

  const updateField = (field: keyof ArticleInput, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const submitArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextForm = { ...form, tagList: parseTags(tagInput) };
    const nextErrors = [
      !nextForm.username.trim() ? '请填写用户名' : '',
      !nextForm.title.trim() ? '请填写文章标题' : '',
      !nextForm.description.trim() ? '请填写文章简介' : '',
      !nextForm.body.trim() ? '请填写文章正文' : '',
    ].filter(Boolean);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    const response =
      isEditing && slug
        ? await api.updateArticle(slug, nextForm)
        : await api.createArticle(nextForm);

    onNavigate({ name: 'article', slug: response.article.slug });
  };

  return (
    <main className="editor-page container narrow">
      <h1>{isEditing ? '编辑文章' : '发布文章'}</h1>
      <p className="page-note">
        只需要填写用户名即可发布，头像会自动使用用户名第一个字。
      </p>

      {errors.length > 0 && (
        <ul className="error-messages">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <ArticleEditorForm
        form={form}
        tagInput={tagInput}
        isEditing={isEditing}
        onFieldChange={updateField}
        onTagInputChange={setTagInput}
        onSubmit={submitArticle}
      />
    </main>
  );
}
