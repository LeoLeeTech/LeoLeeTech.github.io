import {
	articleBySlug,
	articleIdBySlug,
	commentById,
	createArticleRow,
	createCommentRow,
	deleteArticleRow,
	deleteCommentRow,
	listArticleRows,
	listCommentRows,
	listTagNames,
	syncArticleTags,
	uniqueSlug,
	updateArticleRow,
	updateCommentRow,
} from './db';
import { apiError, empty, errorMessage, json, readJson } from './http';
import type { ArticlePayload, CommentPayload } from './types';
import { parsePositiveInteger, requiredString, serializeArticle, serializeComment } from './utils';

// handlers.ts 是“业务逻辑层”。
// 它不关心 URL 正则怎么匹配，也不直接拼很多 SQL；它负责把请求数据变成业务动作。

export async function listArticles(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	// URL 查询参数示例：/api/articles?tag=react&limit=20&offset=0
	const tag = url.searchParams.get('tag') || null;
	const authorName = url.searchParams.get('author') || null;
	const limit = parsePositiveInteger(url.searchParams.get('limit'), 20, 100);
	const offset = parsePositiveInteger(url.searchParams.get('offset'), 0, 10000);
	const { rows, count } = await listArticleRows(env.DB, { tag, authorName, limit, offset });

	return json({
		articles: rows.map((row) => serializeArticle(row, false)),
		articlesCount: count,
	});
}

export async function getArticle(env: Env, slug: string): Promise<Response> {
	// slug 是文章 URL 标识，比如 simple-world-notes。
	const row = await articleBySlug(env.DB, slug);

	if (!row) {
		return apiError('Article not found', 404);
	}

	return json({ article: serializeArticle(row) });
}

export async function createArticle(request: Request, env: Env): Promise<Response> {
	// 前端提交格式：{ article: { username, title, description, body, tagList } }
	const payload = await readJson<ArticlePayload>(request);
	const input = payload?.article ?? {};

	try {
		// requiredString 会确保字段存在且不是空字符串。
		const username = requiredString(input.username, 'username');
		const title = requiredString(input.title, 'title');
		const description = requiredString(input.description, 'description');
		const body = requiredString(input.body, 'body');
		const slug = await uniqueSlug(env.DB, title);
		const timestamp = new Date().toISOString();

		// 先创建文章主表记录，再同步标签关系表。
		await createArticleRow(env.DB, { slug, username, title, description, body, timestamp });

		const articleRow = await articleIdBySlug(env.DB, slug);
		if (!articleRow) {
			throw new Error('Article was not created');
		}

		await syncArticleTags(env.DB, articleRow.id, input.tagList);

		return getArticle(env, slug);
	} catch (caughtError) {
		return apiError(errorMessage(caughtError));
	}
}

export async function updateArticle(request: Request, env: Env, slug: string): Promise<Response> {
	const existing = await articleBySlug(env.DB, slug);

	if (!existing) {
		return apiError('Article not found', 404);
	}

	const payload = await readJson<ArticlePayload>(request);
	const input = payload?.article ?? {};
	// 更新文章时允许只传部分字段；没传的字段沿用旧值。
	const nextTitle = typeof input.title === 'string' && input.title.trim() ? input.title.trim() : existing.title;
	const nextSlug = nextTitle !== existing.title ? await uniqueSlug(env.DB, nextTitle, slug) : slug;
	const timestamp = new Date().toISOString();

	await updateArticleRow(env.DB, {
		id: existing.id,
		slug: nextSlug,
		username: typeof input.username === 'string' && input.username.trim() ? input.username.trim() : existing.username,
		title: nextTitle,
		description: typeof input.description === 'string' && input.description.trim() ? input.description.trim() : existing.description,
		body: typeof input.body === 'string' && input.body.trim() ? input.body.trim() : existing.body,
		timestamp,
	});

	if (Array.isArray(input.tagList)) {
		await syncArticleTags(env.DB, existing.id, input.tagList);
	}

	return getArticle(env, nextSlug);
}

export async function deleteArticle(env: Env, slug: string): Promise<Response> {
	const existing = await articleIdBySlug(env.DB, slug);

	if (!existing) {
		return apiError('Article not found', 404);
	}

	// 数据库外键设置了 ON DELETE CASCADE，所以删除文章会自动删除文章评论和标签关系。
	await deleteArticleRow(env.DB, existing.id);
	return empty();
}

export async function listComments(env: Env, slug: string): Promise<Response> {
	// 评论挂在文章下面，所以先通过 slug 找到文章 id。
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return apiError('Article not found', 404);
	}

	const rows = await listCommentRows(env.DB, articleRow.id);

	return json({ comments: rows.map(serializeComment) });
}

export async function createComment(request: Request, env: Env, slug: string): Promise<Response> {
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return apiError('Article not found', 404);
	}

	// 前端提交格式：{ comment: { username, body } }
	const payload = await readJson<CommentPayload>(request);
	const input = payload?.comment ?? {};

	try {
		const username = requiredString(input.username, 'username');
		const body = requiredString(input.body, 'body');
		const timestamp = new Date().toISOString();
		const comment = await createCommentRow(env.DB, { articleId: articleRow.id, username, body, timestamp });

		return json({ comment: serializeComment(comment) }, 201);
	} catch (caughtError) {
		return apiError(errorMessage(caughtError));
	}
}

export async function updateComment(request: Request, env: Env, slug: string, commentId: number): Promise<Response> {
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return apiError('Article not found', 404);
	}

	const existingComment = await commentById(env.DB, articleRow.id, commentId);

	if (!existingComment) {
		return apiError('Comment not found', 404);
	}

	// Simple World 没有登录系统，所以更新评论不检查作者权限。
	const payload = await readJson<CommentPayload>(request);
	const input = payload?.comment ?? {};

	try {
		const username = requiredString(input.username, 'username');
		const body = requiredString(input.body, 'body');
		const timestamp = new Date().toISOString();
		const comment = await updateCommentRow(env.DB, { articleId: articleRow.id, commentId, username, body, timestamp });

		return json({ comment: serializeComment(comment) });
	} catch (caughtError) {
		return apiError(errorMessage(caughtError));
	}
}

export async function deleteComment(env: Env, slug: string, commentId: number): Promise<Response> {
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return apiError('Article not found', 404);
	}

	const existingComment = await commentById(env.DB, articleRow.id, commentId);

	if (!existingComment) {
		return apiError('Comment not found', 404);
	}

	await deleteCommentRow(env.DB, articleRow.id, commentId);
	return empty();
}

export async function listTags(env: Env): Promise<Response> {
	// 标签来自 tags 表，用于前端首页右侧 Popular Tags。
	return json({ tags: await listTagNames(env.DB) });
}
