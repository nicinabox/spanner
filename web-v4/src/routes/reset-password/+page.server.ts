import { requestReset } from '$lib/data/session';
import { getHTTPErrors } from '$lib/utils/actions';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		prefilledEmail: url.searchParams.get('email') ?? ''
	};
};

export const actions = {
	request: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email || email.trim() === '') {
			return fail(422, { errors: [{ id: 'email', title: "Email can't be blank" }] });
		}

		try {
			await requestReset({ email: email.trim() });
			return { status: 'pending' };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	}
} satisfies Actions;
