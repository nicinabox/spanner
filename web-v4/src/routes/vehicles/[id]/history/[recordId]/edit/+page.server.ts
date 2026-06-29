import { getVehicle } from '$lib/data/vehicles';
import { getHistoryEntry } from '$lib/data/history';
import { uploadRecord, deleteAttachment, toMultipartFormData } from '$lib/data/multipart';
import { decode } from '$lib/utils/form';
import { validateAttachmentFile } from '$lib/utils/file-validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);

	if (vehicle.retired) {
		redirect(303, `/vehicles/${params.id}`);
	}

	const record = await getHistoryEntry(params.id!, params.recordId!, locals);
	return { vehicle, record };
};

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData, {
			date: 'string',
			notes: 'string',
			mileage: 'number',
			cost: 'number'
		});

		if (!data.date) {
			return fail(400, { errors: [{ id: 'date', title: 'Date is required' }] });
		}
		if (!data.notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Notes is required' }] });
		}

		// Process deletions BEFORE update so the multipart PUT doesn't include them.
		const toDelete = (formData.get('attachments_to_delete')?.toString() ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		const files = formData.getAll('record[attachments][]') as File[];

		if (files.length > 10) {
			return fail(422, {
				errors: [{ id: 'attachments', title: 'Maximum 10 files per record' }]
			});
		}

		// Validate file types server-side (magic bytes + fork bomb prevention)
		for (const file of files) {
			if (file.size === 0) {
				return fail(422, {
					errors: [{ id: 'attachments', title: `"${file.name}" is empty` }]
				});
			}
			const result = await validateAttachmentFile(file, { maxSize: 10 * 1024 * 1024 });
			if (!result.valid) {
				return fail(422, {
					errors: [{ id: 'attachments', title: result.reason }]
				});
			}
		}

		const body = toMultipartFormData(
			{
				date: data.date,
				notes: data.notes,
				mileage: typeof data.mileage === 'number' ? data.mileage : null,
				cost: typeof data.cost === 'number' ? data.cost : null
			},
			{ prefix: 'record' }
		);
		for (const file of files) {
			body.append('record[attachments][]', file);
		}

		try {
			for (const signedId of toDelete) {
				await deleteAttachment(params.id!, params.recordId!, signedId, locals);
			}
			await uploadRecord(params.id!, params.recordId!, body, locals);
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
