import { env } from '$env/dynamic/private';
import { requestEmailChange } from '$lib/data/settings';
import { getHTTPErrors } from '$lib/utils/actions';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { email: locals.session?.email };
};

export const actions = {
	changeEmail: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email || email.trim() === '') {
			return fail(422, { errors: [{ id: 'email', title: "Email can't be blank" }] });
		}

		const host = env.PUBLIC_HOST || url.origin;

		try {
			await requestEmailChange(email.trim(), host, locals);
			return { success: true, email: email.trim() };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	},
} satisfies Actions;
