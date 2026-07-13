import { getVehicle } from '$lib/data/vehicles';
import { getHistoryEntry, deleteHistoryEntry } from '$lib/data/history';
import { getClassifications } from '$lib/data/classifications';
import { uploadRecord, deleteAttachment, toMultipartFormData } from '$lib/data/multipart';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { validateAttachments } from '$lib/utils/file-validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { recordFormSchema } from '../../schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const [vehicle, record, classifications] = await Promise.all([
		getVehicle(params.id!, locals),
		getHistoryEntry(params.id!, params.recordId!, locals),
		getClassifications(params.id!, locals),
	]);

	if (vehicle.retired) {
		redirect(303, `/vehicles/${params.id}`);
	}

	return { vehicle, record, classifications };
};

export const actions = {
	update: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, recordFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		// Read attachments and classification IDs after schema parse so the
		// iterator isn't disturbed by the FormData → entries conversion.
		const files = formData.getAll('record[attachments][]') as File[];
		const classificationIds = formData.getAll('record[classification_ids][]');

		// Process deletions BEFORE update so the multipart PUT doesn't include them.
		const toDelete = (formData.get('attachments_to_delete')?.toString() ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		const validation = await validateAttachments(files);
		if (!validation.valid) {
			return fail(422, {
				errors: [{ id: 'attachments', title: validation.reason }],
			});
		}

		const body = toMultipartFormData(
			{
				date: parsed.data.date,
				notes: parsed.data.notes,
				mileage: parsed.data.mileage,
				cost: parsed.data.cost,
			},
			{ prefix: 'record' },
		);
		for (const file of files) {
			body.append('record[attachments][]', file);
		}
		for (const id of classificationIds) {
			body.append('record[classification_ids][]', id);
		}

		for (const signedId of toDelete) {
			await deleteAttachment(params.id!, params.recordId!, signedId, locals);
		}
		await uploadRecord(params.id!, params.recordId!, body, locals);

		redirect(303, `/vehicles/${params.id}`);
	}),

	delete: withActionErrors(async ({ locals, params }) => {
		// Note: also need to delete attachments on record delete, but backend
		// handles this automatically via Active Storage dependent destroy.
		await deleteHistoryEntry(params.id!, params.recordId!, locals);
		redirect(303, `/vehicles/${params.id}`);
	}),
} satisfies Actions;
