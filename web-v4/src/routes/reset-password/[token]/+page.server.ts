import { resetPassword } from '$lib/data/session';
import { setSession } from '$lib/utils/session';
import { HTTPError } from '$lib/data/client';
import { withActionErrors } from '$lib/utils/actions';
import { decode, validate } from '$lib/utils/formData';
import { fail, redirect } from '@sveltejs/kit';
import { passwordSchema } from '$lib/schemas/auth';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';

const passwordMatchCheck = v.check(
	(value: { password: string; confirmPassword: string }) =>
		value.password === value.confirmPassword,
	'Passwords do not match',
);

const resetPasswordSchema = v.pipe(
	v.object({
		password: passwordSchema,
		confirmPassword: v.string('Password confirmation is required'),
	}),
	v.forward(passwordMatchCheck, ['confirmPassword']),
);

export const load: PageServerLoad = async ({ params, locals }) => {
	// If already logged in, go to vehicles
	if (locals.authToken) {
		throw redirect(307, '/vehicles');
	}
	return { token: params.token };
};

export const actions = {
	resetPassword: withActionErrors(async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), resetPasswordSchema);
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
