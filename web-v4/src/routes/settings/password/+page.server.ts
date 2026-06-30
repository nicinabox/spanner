import { setPassword } from '$lib/data/session';
import { getCurrentUser } from '$lib/data/user';
import { getHTTPErrors } from '$lib/utils/actions';
import { safeAsync } from '$lib/utils/async';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [user] = await safeAsync(getCurrentUser(locals));
	if (!user) {
		throw redirect(303, '/');
	}
	return { passwordEnabled: user?.passwordEnabled ?? false };
};

export const actions = {
	set: async ({ request, locals }) => {
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
			await setPassword(
				{
					password,
					currentPassword: (data.current_password as string) || undefined
				},
				locals
			);
			return { success: true };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	}
} satisfies Actions;
