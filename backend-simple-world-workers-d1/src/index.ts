import { apiError, errorMessage } from './http';
import { route } from './router';

export default {
	async fetch(request, env) {
		try {
			return await route(request, env);
		} catch (caughtError) {
			return apiError(errorMessage(caughtError), 500);
		}
	},
} satisfies ExportedHandler<Env>;
