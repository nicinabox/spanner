import { resetPassword } from '$lib/data/session';
import { setSession } from '$lib/utils/session';
import { HTTPError } from '$lib/data/client';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm, resetPasswordSchema } from '$lib/utils/schema';
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
	reset: withActionErrors(async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, resetPasswordSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		try {
			const session = await resetPassword(params.token!, { password: parsed.data.password });
			await setSession(cookies, session);
		} catch (error) {
			if (error instanceof HTTPError && error.status === 422) {
				return fail(422, error.data);
			}
			return fail(401, {
				errors: [{ id: 'form', title: 'Invalid or expired reset link' }],
			});
		}

		redirect(303, '/vehicles');
	}),
} satisfies Actions;
