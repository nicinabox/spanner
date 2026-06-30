import { env } from '$env/dynamic/private';
import { requestEmailChange, deleteAccount } from '$lib/data/settings';
import { setPassword } from '$lib/data/session';
import { getCurrentUser } from '$lib/data/user';
import { getHTTPErrors } from '$lib/utils/actions';
import { safeAsync } from '$lib/utils/async';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [user] = await safeAsync(getCurrentUser(locals));
	return {
		email: locals.session?.email,
		passwordEnabled: user?.passwordEnabled ?? false
	};
};

export const actions = {
	changeEmail: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email || email.trim() === '') {
			return fail(422, { errors: [{ id: 'email', title: "Email can't be blank" }] });
		}

		const host = env.WEB_URL || url.origin;

		try {
			await requestEmailChange(email.trim(), host, locals);
			return { emailSuccess: true, email: email.trim() };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	},

	changePassword: async ({ request, locals }) => {
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
			await setPassword({ password }, locals);
			return { passwordSuccess: true };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	},

	delete: async ({ locals }) => {
		try {
			await deleteAccount(locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, '/');
	},
} satisfies Actions;
