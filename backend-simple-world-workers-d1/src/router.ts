import { createArticle, createComment, deleteArticle, deleteComment, getArticle, listArticles, listComments, listTags, updateArticle, updateComment } from './handlers';
import { apiError, empty, json } from './http';

export async function route(request: Request, env: Env): Promise<Response> {
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

	return apiError('Not found', 404);
}
