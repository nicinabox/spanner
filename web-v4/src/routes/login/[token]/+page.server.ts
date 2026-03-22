import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { signin } from '$lib/data/session';
import { setSession } from '$lib/utils/session';
import { safeAsync } from '$lib/utils/async';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	// Check if user is already logged in - redirect immediately without validating token
	if (locals.authToken) {
		throw redirect(307, '/vehicles');
	}

	const token = params.token;

	// Validate the token with the API
	const [session, error] = await safeAsync(signin(token));

	if (error || !session) {
		// Return error to display in the UI
		return {
			error: error?.message || 'Login failed'
		};
	}

	// Store session in encrypted cookie
	await setSession(cookies, session);

	// Redirect to vehicles page
	throw redirect(303, '/vehicles');
};
