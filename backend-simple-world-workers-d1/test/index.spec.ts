import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('Apple Community worker', () => {
	it('responds with health metadata in unit style', async () => {
		const request = new Request('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			name: '苹果社区 API',
			status: '正常',
			database: 'D1',
		});
	});

	it('responds with health metadata in integration style', async () => {
		const response = await SELF.fetch('http://example.com');

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			name: '苹果社区 API',
			status: '正常',
			database: 'D1',
		});
	});
});
