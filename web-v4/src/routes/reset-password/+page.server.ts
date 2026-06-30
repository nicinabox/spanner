import { requestReset } from '$lib/data/session';
import { getHTTPErrors } from '$lib/utils/actions';
import { parseForm, requestResetSchema } from '$lib/utils/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		prefilledEmail: url.searchParams.get('email') ?? '',
	};
};

export const actions = {
	request: async ({ request }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, requestResetSchema);

		if (parsed.errors) {
			return fail(422, { errors: parsed.errors });
		}

		try {
			await requestReset({ email: parsed.data.email });
			return { status: 'pending' };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	},
} satisfies Actions;
