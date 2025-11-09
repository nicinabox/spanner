import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { sessionOptions } from '$lib/utils/session';

export const load: PageServerLoad = async ({ cookies }) => {
	// Delete the session cookie
	cookies.delete(sessionOptions.cookieName, {
		path: '/',
		...sessionOptions.cookieOptions
	});

	// Redirect to home page
	throw redirect(302, '/');
};
