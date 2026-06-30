import { PUBLIC_EMAIL_ENABLED, WEB_URL } from '$app/env/private';
import * as session from '$lib/data/session';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setSession } from '$lib/utils/session';
import { getCurrentUser } from '$lib/data/user';
import { safeAsync } from '$lib/utils/async';
import { getHTTPErrors } from '$lib/utils/actions';

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
		const data = Object.fromEntries(formData);
		const host = WEB_URL || url.origin;

		try {
			const result = await session.login({
				email: data.email as string,
				password: (data.password as string) || undefined,
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
		const data = Object.fromEntries(formData);
		const host = WEB_URL || url.origin;

		try {
			await session.login({
				email: data.email as string,
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
		const data = Object.fromEntries(formData);

		const token = data.token as string;
		if (!token || token.trim() === '') {
			return fail(422, {
				status: 'pending',
				errors: [{ id: 'token', title: "Token can't be blank" }],
			});
		}

		try {
			const sess = await session.signin(token);
			await setSession(cookies, sess);
		} catch (error) {
			return fail(422, { status: 'pending', ...getHTTPErrors(error) });
		}

		redirect(303, '/vehicles');
	},
} satisfies Actions;
