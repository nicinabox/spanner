import { deleteHistoryEntry, getHistoryEntry, updateHistoryEntry } from '$lib/data/history';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id, entryId } = params;
	const record = await getHistoryEntry(id, entryId, locals);
	return {
		record,
		appBar: {
			backAction: {
				href: `/vehicles/${id}`,
				text: 'Back'
			}
		}
	};
};

export const actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const data = decode(formData);

		try {
			await updateHistoryEntry(params.id!, params.entryId!, data, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}`);
	},
	delete: async ({ params, locals }) => {
		try {
			await deleteHistoryEntry(params.id!, params.entryId!, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}`);
	}
} satisfies Actions;
