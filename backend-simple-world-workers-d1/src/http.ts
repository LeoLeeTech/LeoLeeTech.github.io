// 所有接口都允许跨域，方便本地前端 http://127.0.0.1:5174 调用后端 8787。
export const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Max-Age': '86400',
} as const;

// JSON 响应头：告诉浏览器“我返回的是 JSON 文本”。
const jsonHeaders = {
	...corsHeaders,
	'Content-Type': 'application/json; charset=utf-8',
} as const;

// 返回 JSON 的小工具，避免每个接口都重复 new Response(JSON.stringify(...))。
export function json<T>(data: T, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: jsonHeaders,
	});
}

// 返回空内容，常用于 DELETE 成功后的 204。
export function empty(status = 204): Response {
	return new Response(null, {
		status,
		headers: corsHeaders,
	});
}

// Simple World 约定错误格式为 { errors: { body: [...] } }。
export function apiError(message: string, status = 400): Response {
	return json({ errors: { body: [message] } }, status);
}

// 安全读取 JSON：如果请求体不是合法 JSON，就返回 null。
export async function readJson<T>(request: Request): Promise<T | null> {
	try {
		return (await request.json()) as T;
	} catch {
		return null;
	}
}

// unknown 类型不能直接 .message，所以这里统一转成字符串。
export function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : 'Internal server error';
}
