import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Simple World worker', () => {
	it('responds with API health metadata (unit style)', async () => {
		const request = new Request('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			name: 'Simple World API',
			status: 'ok',
			database: 'D1',
		});
	});

	it('responds with API health metadata (integration style)', async () => {
		const response = await SELF.fetch('http://example.com');

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			name: 'Simple World API',
			status: 'ok',
			database: 'D1',
		});
	});
});
