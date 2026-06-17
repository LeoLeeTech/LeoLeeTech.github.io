import type { ArticleIdRow, ArticleListParams, ArticleRow, CommentRow, CountRow, TagRow } from './types';
import { normalizeTags, slugify } from './utils';

const articleSelect = `
	SELECT
		a.id,
		a.slug,
		a.username,
		a.title,
		a.description,
		a.body,
		a.created_at,
		a.updated_at,
		COALESCE(GROUP_CONCAT(t.name), '') AS tag_names
	FROM articles a
	LEFT JOIN article_tags at ON at.article_id = a.id
	LEFT JOIN tags t ON t.id = at.tag_id
`;

const articleListWhere = `
	WHERE (?1 IS NULL OR a.username = ?1)
		AND (
			?2 IS NULL OR EXISTS (
				SELECT 1
				FROM article_tags filter_at
				JOIN tags filter_t ON filter_t.id = filter_at.tag_id
				WHERE filter_at.article_id = a.id AND filter_t.name = ?2
			)
		)
`;

export async function uniqueSlug(db: D1Database, title: string, currentSlug = ''): Promise<string> {
	const baseSlug = slugify(title);
	let slug = baseSlug;
	let suffix = 2;

	while (await db.prepare('SELECT id FROM articles WHERE slug = ? AND slug != ?').bind(slug, currentSlug).first<ArticleIdRow>()) {
		slug = `${baseSlug}-${suffix}`;
		suffix += 1;
	}

	return slug;
}

export async function articleBySlug(db: D1Database, slug: string): Promise<ArticleRow | null> {
	return db
		.prepare(
			`
			${articleSelect}
			WHERE a.slug = ?
			GROUP BY a.id
		`,
		)
		.bind(slug)
		.first<ArticleRow>();
}

export async function articleIdBySlug(db: D1Database, slug: string): Promise<ArticleIdRow | null> {
	return db.prepare('SELECT id FROM articles WHERE slug = ?').bind(slug).first<ArticleIdRow>();
}

export async function listArticleRows(
	db: D1Database,
	{ authorName, tag, limit, offset }: ArticleListParams,
): Promise<{ rows: ArticleRow[]; count: number }> {
	const articleRows = await db
		.prepare(
			`
			${articleSelect}
			${articleListWhere}
			GROUP BY a.id
			ORDER BY a.created_at DESC, a.id DESC
			LIMIT ?3 OFFSET ?4
		`,
		)
		.bind(authorName, tag, limit, offset)
		.all<ArticleRow>();

	const countRow = await db
		.prepare(
			`
			SELECT COUNT(*) AS count
			FROM articles a
			${articleListWhere}
		`,
		)
		.bind(authorName, tag)
		.first<CountRow>();

	return {
		rows: articleRows.results,
		count: countRow?.count ?? 0,
	};
}

export async function createArticleRow(
	db: D1Database,
	input: { slug: string; username: string; title: string; description: string; body: string; timestamp: string },
): Promise<void> {
	await db
		.prepare(
			`
			INSERT INTO articles (slug, username, title, description, body, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`,
		)
		.bind(input.slug, input.username, input.title, input.description, input.body, input.timestamp, input.timestamp)
		.run();
}

export async function updateArticleRow(
	db: D1Database,
	input: { id: number; slug: string; username: string; title: string; description: string; body: string; timestamp: string },
): Promise<void> {
	await db
		.prepare(
			`
			UPDATE articles
			SET slug = ?,
				username = ?,
				title = ?,
				description = ?,
				body = ?,
				updated_at = ?
			WHERE id = ?
		`,
		)
		.bind(input.slug, input.username, input.title, input.description, input.body, input.timestamp, input.id)
		.run();
}

export async function deleteArticleRow(db: D1Database, articleId: number): Promise<void> {
	await db.prepare('DELETE FROM articles WHERE id = ?').bind(articleId).run();
}

export async function syncArticleTags(db: D1Database, articleId: number, tagList: unknown): Promise<void> {
	await db.prepare('DELETE FROM article_tags WHERE article_id = ?').bind(articleId).run();

	for (const tag of normalizeTags(tagList)) {
		await db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').bind(tag).run();
		const tagRow = await db.prepare('SELECT id, name FROM tags WHERE name = ?').bind(tag).first<TagRow>();

		if (!tagRow) {
			throw new Error(`Tag "${tag}" was not created`);
		}

		await db.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)').bind(articleId, tagRow.id).run();
	}
}

export async function listCommentRows(db: D1Database, articleId: number): Promise<CommentRow[]> {
	const rows = await db
		.prepare(
			`
			SELECT id, username, body, created_at, updated_at
			FROM comments
			WHERE article_id = ?
			ORDER BY created_at ASC, id ASC
		`,
		)
		.bind(articleId)
		.all<CommentRow>();

	return rows.results;
}

export async function commentById(db: D1Database, articleId: number, commentId: number): Promise<CommentRow | null> {
	return db
		.prepare('SELECT id, username, body, created_at, updated_at FROM comments WHERE article_id = ? AND id = ?')
		.bind(articleId, commentId)
		.first<CommentRow>();
}

export async function createCommentRow(
	db: D1Database,
	input: { articleId: number; username: string; body: string; timestamp: string },
): Promise<CommentRow> {
	const result = await db
		.prepare(
			`
			INSERT INTO comments (article_id, username, body, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?)
		`,
		)
		.bind(input.articleId, input.username, input.body, input.timestamp, input.timestamp)
		.run();

	const comment = await db
		.prepare('SELECT id, username, body, created_at, updated_at FROM comments WHERE id = ?')
		.bind(result.meta.last_row_id)
		.first<CommentRow>();

	if (!comment) {
		throw new Error('Comment was not created');
	}

	return comment;
}

export async function updateCommentRow(
	db: D1Database,
	input: { articleId: number; commentId: number; username: string; body: string; timestamp: string },
): Promise<CommentRow> {
	await db
		.prepare(
			`
			UPDATE comments
			SET username = ?,
				body = ?,
				updated_at = ?
			WHERE article_id = ? AND id = ?
		`,
		)
		.bind(input.username, input.body, input.timestamp, input.articleId, input.commentId)
		.run();

	const comment = await commentById(db, input.articleId, input.commentId);

	if (!comment) {
		throw new Error('Comment not found');
	}

	return comment;
}

export async function deleteCommentRow(db: D1Database, articleId: number, commentId: number): Promise<void> {
	await db.prepare('DELETE FROM comments WHERE article_id = ? AND id = ?').bind(articleId, commentId).run();
}

export async function listTagNames(db: D1Database): Promise<string[]> {
	const rows = await db.prepare('SELECT name FROM tags ORDER BY name ASC').all<Pick<TagRow, 'name'>>();

	return rows.results.map((row) => row.name);
}
