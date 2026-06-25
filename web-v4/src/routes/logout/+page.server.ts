import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { sessionOptions } from '$lib/utils/session';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete(sessionOptions.cookieName, {
		path: '/',
		...sessionOptions.cookieOptions
	});

	throw redirect(302, '/');
};