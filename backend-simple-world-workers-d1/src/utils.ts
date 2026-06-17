import type { Article, ArticleInput, ArticleRow, Author, Comment, CommentRow } from './types';

// 根据用户名生成头像字母，例如 leo -> L。
export function avatarInitial(username: string): string {
	return username.trim().charAt(0).toUpperCase() || '?';
}

// 后端返回 author 时统一带 username 和 avatarInitial。
export function author(username: string): Author {
	const normalizedUsername = username.trim();

	return {
		username: normalizedUsername,
		avatarInitial: avatarInitial(normalizedUsername),
	};
}

// 把数据库字段名 created_at 转成前端更习惯的 createdAt。
export function serializeArticle(row: ArticleRow, includeBody = true): Article {
	const article: Article = {
		slug: row.slug,
		title: row.title,
		description: row.description,
		tagList: row.tag_names ? row.tag_names.split(',').filter(Boolean) : [],
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		author: author(row.username),
	};

	if (includeBody) {
		article.body = row.body;
	}

	return article;
}

// 把数据库评论行转换成接口返回格式。
export function serializeComment(row: CommentRow): Comment {
	return {
		id: row.id,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		body: row.body,
		author: author(row.username),
	};
}

// 根据标题生成 URL 友好的 slug，例如 "Hello World" -> "hello-world"。
export function slugify(value: string): string {
	const slug = value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);

	return slug || `article-${Date.now()}`;
}

// 标签需要去空格、去空值、去重复，避免数据库里出现脏数据。
export function normalizeTags(tagList: unknown): string[] {
	if (!Array.isArray(tagList)) {
		return [];
	}

	return [...new Set(tagList.map((tag) => String(tag).trim()).filter(Boolean))];
}

// 分页参数来自 URL，是字符串；这里统一转成安全数字。
export function parsePositiveInteger(value: string | null, fallback: number, maximum: number): number {
	const parsed = Number.parseInt(value ?? '', 10);

	if (Number.isNaN(parsed) || parsed < 0) {
		return fallback;
	}

	return Math.min(parsed, maximum);
}

// 简单校验必填字符串字段，空字符串直接抛错。
export function requiredString(value: unknown, fieldName: keyof ArticleInput | 'body'): string {
	if (typeof value !== 'string' || !value.trim()) {
		throw new Error(`${fieldName} is required`);
	}

	return value.trim();
}
