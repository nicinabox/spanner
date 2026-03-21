import * as session from '$lib/data/session';
import { apiConfig } from '$lib/data/config';
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
	create: async ({ request }) => {
		console.log('API Config baseUrl:', apiConfig.baseUrl);
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			await session.create(data as never);
			return { status: 'pending' };
		} catch (error) {
			console.error('Session create error:', error);
			return fail(422, getHTTPErrors(error));
		}
	},
	signin: async ({ cookies, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			const sess = await session.signin(data.token as string);
			await setSession(cookies, sess);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, '/vehicles');
	}
} satisfies Actions;
