import { createArticle, createComment, deleteArticle, deleteComment, getArticle, listArticles, listComments, listTags, updateArticle, updateComment } from './handlers';
import { apiError, empty, json } from './http';

// router.ts 只负责判断“请求走哪个函数”。
// 例如：GET /api/articles 应该交给 listArticles。
export async function route(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const method = request.method.toUpperCase();
	// 去掉路径末尾多余的 /，让 /api/articles 和 /api/articles/ 都能被当成同一个路径。
	const pathname = url.pathname.replace(/\/+$/, '') || '/';

	// 浏览器跨域请求前可能会先发 OPTIONS 预检请求。
	if (method === 'OPTIONS') {
		return empty(204);
	}

	// 健康检查接口：打开 Worker 根地址时能看到服务正常。
	if (pathname === '/') {
		return json({
			name: 'Simple World API',
			status: 'ok',
			database: 'D1',
		});
	}

	// 文章集合接口：列表和创建都在 /api/articles。
	if (pathname === '/api/articles') {
		if (method === 'GET') return listArticles(request, env);
		if (method === 'POST') return createArticle(request, env);
	}

	// 评论接口路径里有文章 slug，也可能有评论 id。
	const commentsMatch = pathname.match(/^\/api\/articles\/([^/]+)\/comments(?:\/(\d+))?$/);
	if (commentsMatch) {
		const slug = decodeURIComponent(commentsMatch[1]);
		const commentId = commentsMatch[2] ? Number.parseInt(commentsMatch[2], 10) : null;

		if (!commentId && method === 'GET') return listComments(env, slug);
		if (!commentId && method === 'POST') return createComment(request, env, slug);
		if (commentId && method === 'PUT') return updateComment(request, env, slug, commentId);
		if (commentId && method === 'DELETE') return deleteComment(env, slug, commentId);
	}

	// 单篇文章接口：获取、更新、删除都靠 slug 定位文章。
	const articleMatch = pathname.match(/^\/api\/articles\/([^/]+)$/);
	if (articleMatch) {
		const slug = decodeURIComponent(articleMatch[1]);

		if (method === 'GET') return getArticle(env, slug);
		if (method === 'PUT') return updateArticle(request, env, slug);
		if (method === 'DELETE') return deleteArticle(env, slug);
	}

	// 标签接口：给前端右侧热门标签栏使用。
	if (pathname === '/api/tags' && method === 'GET') {
		return listTags(env);
	}

	return apiError('Not found', 404);
}
