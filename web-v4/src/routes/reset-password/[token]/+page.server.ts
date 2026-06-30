import { resetPassword } from '$lib/data/session';
import { setSession } from '$lib/utils/session';
import { getHTTPErrors } from '$lib/utils/actions';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	// If already logged in, go to vehicles
	if (locals.authToken) {
		throw redirect(307, '/vehicles');
	}
	return { token: params.token };
};

export const actions = {
	reset: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const password = data.password as string;
		if (!password || password.length < 8) {
			return fail(422, {
				errors: [{ id: 'password', title: 'Password must be at least 8 characters' }]
			});
		}

		if (password !== data.confirm_password) {
			return fail(422, {
				errors: [{ id: 'confirm_password', title: 'Passwords do not match' }]
			});
		}

		try {
			const session = await resetPassword(params.token, { password });
			await setSession(cookies, session);
		} catch (error) {
			return fail(401, getHTTPErrors(error));
		}

		redirect(303, '/vehicles');
	}
} satisfies Actions;
