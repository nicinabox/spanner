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
};

export const actions = {
	create: async ({ request, url }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		// Pass the frontend host for email links
		const host = process.env.PUBLIC_HOST || url.origin;

		try {
			await session.create({ email: data.email as string, host });
			return { status: 'pending' };
		} catch (error) {
			console.error('Session create error:', error);
			return fail(422, getHTTPErrors(error));
		}
	},
	signin: async ({ cookies, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const token = data.token as string;
		if (!token || token.trim() === '') {
			return fail(422, { status: 'pending', errors: [{ id: 'token', title: "Token can't be blank" }] });
		}

		try {
			const sess = await session.signin(token);
			await setSession(cookies, sess);
		} catch (error) {
			return fail(422, { status: 'pending', ...getHTTPErrors(error) });
		}

		redirect(303, '/vehicles');
	}
} satisfies Actions;
