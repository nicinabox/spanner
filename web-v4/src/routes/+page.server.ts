import { PUBLIC_EMAIL_ENABLED, WEB_URL } from '$app/env/private';
import * as session from '$lib/data/session';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setSession } from '$lib/utils/session';
import { getCurrentUser } from '$lib/data/user';
import { safeAsync } from '$lib/utils/async';
import { getHTTPErrors } from '$lib/utils/actions';
import { loginSchema, parseForm, tokenSchema } from '$lib/utils/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const [user] = await safeAsync(getCurrentUser(locals));

	if (user) {
		return redirect(307, '/vehicles');
	}

	return {
		emailEnabled: PUBLIC_EMAIL_ENABLED !== 'false',
	};
};

export const actions = {
	login: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, loginSchema);

		if (parsed.errors) {
			return fail(401, { errors: parsed.errors });
		}

		const host = WEB_URL || url.origin;

		try {
			const result = await session.login({
				email: parsed.data.email,
				password: parsed.data.password || undefined,
				host,
			});

			if (result && typeof result === 'object' && 'authToken' in result) {
				await setSession(cookies, result as session.Session);
				redirect(303, '/vehicles');
			}

			return { status: 'pending' };
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'location' in error) throw error;
			return fail(401, {
				errors: [{ id: 'form', title: 'Invalid email or password' }],
			});
		}
	},

	magicLink: async ({ request, url }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, loginSchema);

		if (parsed.errors) {
			return fail(422, { errors: parsed.errors });
		}

		const host = WEB_URL || url.origin;

		try {
			await session.login({
				email: parsed.data.email,
				host,
			});

			return { status: 'pending' };
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'location' in error) throw error;
			return fail(422, {
				errors: [{ id: 'form', title: 'Could not send magic link. Please try again.' }],
			});
		}
	},

	signin: async ({ cookies, request }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, tokenSchema);

		if (parsed.errors) {
			return fail(422, { status: 'pending', errors: parsed.errors });
		}

		try {
			const sess = await session.signin(parsed.data.token);
			await setSession(cookies, sess);
		} catch (error) {
			return fail(422, { status: 'pending', ...getHTTPErrors(error) });
		}

		redirect(303, '/vehicles');
	},
} satisfies Actions;
