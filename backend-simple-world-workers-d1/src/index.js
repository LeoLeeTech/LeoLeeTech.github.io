const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Max-Age': '86400',
};

const jsonHeaders = {
	...corsHeaders,
	'Content-Type': 'application/json; charset=utf-8',
};

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

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: jsonHeaders,
	});
}

function empty(status = 204) {
	return new Response(null, {
		status,
		headers: corsHeaders,
	});
}

function error(message, status = 400) {
	return json({ errors: { body: [message] } }, status);
}

function avatarInitial(username) {
	return username.trim().charAt(0).toUpperCase() || '?';
}

function author(username) {
	const normalizedUsername = username.trim();
	return {
		username: normalizedUsername,
		avatarInitial: avatarInitial(normalizedUsername),
	};
}

function serializeArticle(row, includeBody = true) {
	const article = {
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

function serializeComment(row) {
	return {
		id: row.id,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		body: row.body,
		author: author(row.username),
	};
}

function slugify(value) {
	const slug = value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);

	return slug || `article-${Date.now()}`;
}

function normalizeTags(tagList) {
	if (!Array.isArray(tagList)) {
		return [];
	}

	return [...new Set(tagList.map((tag) => String(tag).trim()).filter(Boolean))];
}

async function readJson(request) {
	try {
		return await request.json();
	} catch {
		return null;
	}
}

async function uniqueSlug(db, title, currentSlug = '') {
	const baseSlug = slugify(title);
	let slug = baseSlug;
	let suffix = 2;

	while (await db.prepare('SELECT id FROM articles WHERE slug = ? AND slug != ?').bind(slug, currentSlug).first()) {
		slug = `${baseSlug}-${suffix}`;
		suffix += 1;
	}

	return slug;
}

async function articleBySlug(db, slug) {
	return db
		.prepare(
			`
			${articleSelect}
			WHERE a.slug = ?
			GROUP BY a.id
		`,
		)
		.bind(slug)
		.first();
}

async function articleIdBySlug(db, slug) {
	return db.prepare('SELECT id FROM articles WHERE slug = ?').bind(slug).first();
}

async function syncArticleTags(db, articleId, tagList) {
	await db.prepare('DELETE FROM article_tags WHERE article_id = ?').bind(articleId).run();

	for (const tag of normalizeTags(tagList)) {
		await db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').bind(tag).run();
		const tagRow = await db.prepare('SELECT id FROM tags WHERE name = ?').bind(tag).first();
		await db.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)').bind(articleId, tagRow.id).run();
	}
}

function parsePositiveInteger(value, fallback, maximum) {
	const parsed = Number.parseInt(value ?? '', 10);

	if (Number.isNaN(parsed) || parsed < 0) {
		return fallback;
	}

	return Math.min(parsed, maximum);
}

function requiredString(value, fieldName) {
	if (typeof value !== 'string' || !value.trim()) {
		throw new Error(`${fieldName} is required`);
	}

	return value.trim();
}

async function listArticles(request, env) {
	const url = new URL(request.url);
	const tag = url.searchParams.get('tag') || null;
	const authorName = url.searchParams.get('author') || null;
	const limit = parsePositiveInteger(url.searchParams.get('limit'), 20, 100);
	const offset = parsePositiveInteger(url.searchParams.get('offset'), 0, 10000);

	const whereSql = `
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

	const articleRows = await env.DB.prepare(
		`
		${articleSelect}
		${whereSql}
		GROUP BY a.id
		ORDER BY a.created_at DESC, a.id DESC
		LIMIT ?3 OFFSET ?4
	`,
	)
		.bind(authorName, tag, limit, offset)
		.all();

	const countRow = await env.DB.prepare(
		`
		SELECT COUNT(*) AS count
		FROM articles a
		${whereSql}
	`,
	)
		.bind(authorName, tag)
		.first();

	return json({
		articles: articleRows.results.map((row) => serializeArticle(row, false)),
		articlesCount: countRow.count,
	});
}

async function getArticle(env, slug) {
	const row = await articleBySlug(env.DB, slug);

	if (!row) {
		return error('Article not found', 404);
	}

	return json({ article: serializeArticle(row) });
}

async function createArticle(request, env) {
	const payload = await readJson(request);
	const input = payload?.article ?? {};

	try {
		const username = requiredString(input.username, 'username');
		const title = requiredString(input.title, 'title');
		const description = requiredString(input.description, 'description');
		const body = requiredString(input.body, 'body');
		const slug = await uniqueSlug(env.DB, title);
		const timestamp = new Date().toISOString();

		await env.DB.prepare(
			`
			INSERT INTO articles (slug, username, title, description, body, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`,
		)
			.bind(slug, username, title, description, body, timestamp, timestamp)
			.run();

		const articleRow = await articleIdBySlug(env.DB, slug);
		await syncArticleTags(env.DB, articleRow.id, input.tagList);

		return getArticle(env, slug);
	} catch (caughtError) {
		return error(caughtError.message);
	}
}

async function updateArticle(request, env, slug) {
	const existing = await articleBySlug(env.DB, slug);

	if (!existing) {
		return error('Article not found', 404);
	}

	const payload = await readJson(request);
	const input = payload?.article ?? {};
	const nextTitle = typeof input.title === 'string' && input.title.trim() ? input.title.trim() : existing.title;
	const nextSlug = nextTitle !== existing.title ? await uniqueSlug(env.DB, nextTitle, slug) : slug;
	const timestamp = new Date().toISOString();

	await env.DB.prepare(
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
		.bind(
			nextSlug,
			typeof input.username === 'string' && input.username.trim() ? input.username.trim() : existing.username,
			nextTitle,
			typeof input.description === 'string' && input.description.trim() ? input.description.trim() : existing.description,
			typeof input.body === 'string' && input.body.trim() ? input.body.trim() : existing.body,
			timestamp,
			existing.id,
		)
		.run();

	if (Array.isArray(input.tagList)) {
		await syncArticleTags(env.DB, existing.id, input.tagList);
	}

	return getArticle(env, nextSlug);
}

async function deleteArticle(env, slug) {
	const existing = await articleIdBySlug(env.DB, slug);

	if (!existing) {
		return error('Article not found', 404);
	}

	await env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(existing.id).run();
	return empty();
}

async function listComments(env, slug) {
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return error('Article not found', 404);
	}

	const rows = await env.DB.prepare(
		`
		SELECT id, username, body, created_at, updated_at
		FROM comments
		WHERE article_id = ?
		ORDER BY created_at ASC, id ASC
	`,
	)
		.bind(articleRow.id)
		.all();

	return json({ comments: rows.results.map(serializeComment) });
}

async function createComment(request, env, slug) {
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return error('Article not found', 404);
	}

	const payload = await readJson(request);
	const input = payload?.comment ?? {};

	try {
		const username = requiredString(input.username, 'username');
		const body = requiredString(input.body, 'body');
		const timestamp = new Date().toISOString();

		const result = await env.DB.prepare(
			`
			INSERT INTO comments (article_id, username, body, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?)
		`,
		)
			.bind(articleRow.id, username, body, timestamp, timestamp)
			.run();

		const comment = await env.DB.prepare('SELECT id, username, body, created_at, updated_at FROM comments WHERE id = ?')
			.bind(result.meta.last_row_id)
			.first();

		return json({ comment: serializeComment(comment) }, 201);
	} catch (caughtError) {
		return error(caughtError.message);
	}
}

async function updateComment(request, env, slug, commentId) {
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return error('Article not found', 404);
	}

	const existingComment = await env.DB.prepare('SELECT id FROM comments WHERE article_id = ? AND id = ?')
		.bind(articleRow.id, commentId)
		.first();

	if (!existingComment) {
		return error('Comment not found', 404);
	}

	const payload = await readJson(request);
	const input = payload?.comment ?? {};

	try {
		const username = requiredString(input.username, 'username');
		const body = requiredString(input.body, 'body');
		const timestamp = new Date().toISOString();

		await env.DB.prepare(
			`
			UPDATE comments
			SET username = ?,
				body = ?,
				updated_at = ?
			WHERE article_id = ? AND id = ?
		`,
		)
			.bind(username, body, timestamp, articleRow.id, commentId)
			.run();

		const comment = await env.DB.prepare('SELECT id, username, body, created_at, updated_at FROM comments WHERE id = ?')
			.bind(commentId)
			.first();

		return json({ comment: serializeComment(comment) });
	} catch (caughtError) {
		return error(caughtError.message);
	}
}

async function deleteComment(env, slug, commentId) {
	const articleRow = await articleIdBySlug(env.DB, slug);

	if (!articleRow) {
		return error('Article not found', 404);
	}

	const existingComment = await env.DB.prepare('SELECT id FROM comments WHERE article_id = ? AND id = ?')
		.bind(articleRow.id, commentId)
		.first();

	if (!existingComment) {
		return error('Comment not found', 404);
	}

	await env.DB.prepare('DELETE FROM comments WHERE article_id = ? AND id = ?').bind(articleRow.id, commentId).run();
	return empty();
}

async function listTags(env) {
	const rows = await env.DB.prepare(
		`
		SELECT name
		FROM tags
		ORDER BY name ASC
	`,
	).all();

	return json({ tags: rows.results.map((row) => row.name) });
}

async function route(request, env) {
	const url = new URL(request.url);
	const method = request.method.toUpperCase();
	const pathname = url.pathname.replace(/\/+$/, '') || '/';

	if (method === 'OPTIONS') {
		return empty(204);
	}

	if (pathname === '/') {
		return json({
			name: 'Simple World API',
			status: 'ok',
			database: 'D1',
		});
	}

	if (pathname === '/api/articles') {
		if (method === 'GET') return listArticles(request, env);
		if (method === 'POST') return createArticle(request, env);
	}

	const commentsMatch = pathname.match(/^\/api\/articles\/([^/]+)\/comments(?:\/(\d+))?$/);
	if (commentsMatch) {
		const slug = decodeURIComponent(commentsMatch[1]);
		const commentId = commentsMatch[2] ? Number.parseInt(commentsMatch[2], 10) : null;

		if (!commentId && method === 'GET') return listComments(env, slug);
		if (!commentId && method === 'POST') return createComment(request, env, slug);
		if (commentId && method === 'PUT') return updateComment(request, env, slug, commentId);
		if (commentId && method === 'DELETE') return deleteComment(env, slug, commentId);
	}

	const articleMatch = pathname.match(/^\/api\/articles\/([^/]+)$/);
	if (articleMatch) {
		const slug = decodeURIComponent(articleMatch[1]);

		if (method === 'GET') return getArticle(env, slug);
		if (method === 'PUT') return updateArticle(request, env, slug);
		if (method === 'DELETE') return deleteArticle(env, slug);
	}

	if (pathname === '/api/tags' && method === 'GET') {
		return listTags(env);
	}

	return error('Not found', 404);
}

export default {
	async fetch(request, env) {
		try {
			return await route(request, env);
		} catch (caughtError) {
			return error(caughtError.message || 'Internal server error', 500);
		}
	},
};
