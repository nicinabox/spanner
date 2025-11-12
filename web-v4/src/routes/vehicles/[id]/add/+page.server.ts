import { createHistoryEntry } from '$lib/data/history';
import { getHTTPErrors } from '$lib/utils/actions';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	addHistoryEntry: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			await createHistoryEntry(params.id!, data, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}`);
	}
} satisfies Actions;
