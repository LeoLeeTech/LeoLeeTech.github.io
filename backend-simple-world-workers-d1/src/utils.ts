import type { Article, ArticleInput, ArticleRow, Author, Comment, CommentRow } from './types';

export function avatarInitial(username: string): string {
	return username.trim().charAt(0).toUpperCase() || '?';
}

export function author(username: string): Author {
	const normalizedUsername = username.trim();

	return {
		username: normalizedUsername,
		avatarInitial: avatarInitial(normalizedUsername),
	};
}

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

export function serializeComment(row: CommentRow): Comment {
	return {
		id: row.id,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		body: row.body,
		author: author(row.username),
	};
}

export function slugify(value: string): string {
	const slug = value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);

	return slug || `article-${Date.now()}`;
}

export function normalizeTags(tagList: unknown): string[] {
	if (!Array.isArray(tagList)) {
		return [];
	}

	return [...new Set(tagList.map((tag) => String(tag).trim()).filter(Boolean))];
}

export function parsePositiveInteger(value: string | null, fallback: number, maximum: number): number {
	const parsed = Number.parseInt(value ?? '', 10);

	if (Number.isNaN(parsed) || parsed < 0) {
		return fallback;
	}

	return Math.min(parsed, maximum);
}

export function requiredString(value: unknown, fieldName: keyof ArticleInput | 'body'): string {
	if (typeof value !== 'string' || !value.trim()) {
		throw new Error(`${fieldName} is required`);
	}

	return value.trim();
}
