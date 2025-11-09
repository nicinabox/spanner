import * as session from '$lib/data/session';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setSession } from '$lib/utils/session';
import { getCurrentUser } from '$lib/data/user';
import { safeAsync } from '$lib/utils/async';

export const load: PageServerLoad = async ({ locals }) => {
	const [user] = await safeAsync(getCurrentUser(locals));

	if (user) {
		return redirect(307, '/vehicles');
	}
};

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return {
				status: 400,
				body: { error: 'Email is required' }
			};
		}

		await session.create({ email });

		return { status: 'pending' };
	},
	signin: async ({ cookies, request }) => {
		const formData = await request.formData();
		const token = formData.get('token') as string;

		if (!token) {
			return {
				status: 400,
				body: { error: 'Login token is required' }
			};
		}

		const sess = await session.signin(token);
		await setSession(cookies, sess);

		throw redirect(303, '/vehicles');
	}
} satisfies Actions;
