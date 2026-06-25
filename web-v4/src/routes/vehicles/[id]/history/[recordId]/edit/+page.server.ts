import { getVehicle } from '$lib/data/vehicles';
import { getHistoryEntry } from '$lib/data/history';
import { uploadRecord, deleteAttachment } from '$lib/data/multipart';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const record = await getHistoryEntry(params.id!, params.recordId!, locals);
	return { vehicle, record };
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const date = formData.get('date')?.toString();
		const notes = formData.get('notes')?.toString() ?? '';

		if (!date) {
			return fail(400, { errors: [{ id: 'date', title: 'Date is required' }] });
		}
		if (!notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Notes is required' }] });
		}

		// Process deletions BEFORE update so the multipart PUT doesn't include them.
		const toDelete = (formData.get('attachments_to_delete')?.toString() ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		try {
			for (const signedId of toDelete) {
				await deleteAttachment(params.id!, params.recordId!, signedId, locals);
			}
			await uploadRecord(params.id!, params.recordId!, formData, locals);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Upload failed';
			return fail(422, {
				errors: [{ id: 'form', title: message }]
			});
		}

		redirect(303, `/vehicles/${params.id}`);
	},

	delete: async ({ locals, params }) => {
		// Note: also need to delete attachments on record delete, but backend
		// handles this automatically via Active Storage dependent destroy.
		const { deleteHistoryEntry } = await import('$lib/data/history');
		await deleteHistoryEntry(params.id!, params.recordId!, locals);
		redirect(303, `/vehicles/${params.id}`);
	}
} satisfies Actions;
