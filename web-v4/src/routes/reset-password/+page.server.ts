import { requestReset } from '$lib/data/session';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { fail } from '@sveltejs/kit';
import { emailSchema } from '$lib/schemas/auth';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';

const requestResetSchema = v.object({
	email: emailSchema,
});

export const load: PageServerLoad = async ({ url }) => {
	return {
		prefilledEmail: url.searchParams.get('email') ?? '',
	};
};

export const actions = {
	requestReset: withActionErrors(async (event) => {
		const formData = await event.request.formData();
		const parsed = parseForm(formData, requestResetSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await requestReset({ email: parsed.data.email }, event.locals);
		return { status: 'pending' };
	}),
} satisfies Actions;
