import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { signin } from '$lib/data/session';
import { setSession } from '$lib/utils/session';
import { safeAsync } from '$lib/utils/async';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	if (locals.authToken) {
		throw redirect(307, '/vehicles');
	}

	const token = params.token;

	const [session, error] = await safeAsync(signin(token));

	if (error || !session) {
		return {
			error: error?.message || 'Login failed'
		};
	}

	await setSession(cookies, session);

	throw redirect(303, '/vehicles');
};