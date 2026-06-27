import { unsubscribe } from '$lib/data/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const token = params.token;

	if (!token) {
		return { message: 'No unsubscribe token provided.' };
	}

	try {
		const data = await unsubscribe(token);
		return { message: data.message };
	} catch {
		return { message: 'Could not reach the server. Please try again later.' };
	}
};
