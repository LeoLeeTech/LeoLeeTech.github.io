import { apiError, errorMessage } from './http';
import { route } from './router';

// Cloudflare Worker 的入口文件。
// 每一次浏览器或前端 fetch 请求，最终都会进入这里的 fetch 函数。
export default {
	async fetch(request, env) {
		try {
			// 真正的路由判断放在 router.ts，这样入口文件保持非常小。
			return await route(request, env);
		} catch (caughtError) {
			// 如果代码里有没处理到的异常，这里统一返回 500，避免 Worker 直接崩掉。
			return apiError(errorMessage(caughtError), 500);
		}
	},
} satisfies ExportedHandler<Env>;
