export const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Max-Age': '86400',
} as const;

const jsonHeaders = {
	...corsHeaders,
	'Content-Type': 'application/json; charset=utf-8',
} as const;

export function json<T>(data: T, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: jsonHeaders,
	});
}

export function empty(status = 204): Response {
	return new Response(null, {
		status,
		headers: corsHeaders,
	});
}

export function apiError(message: string, status = 400): Response {
	return json({ errors: { body: [message] } }, status);
}

export async function readJson<T>(request: Request): Promise<T | null> {
	try {
		return (await request.json()) as T;
	} catch {
		return null;
	}
}

export function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : 'Internal server error';
}
