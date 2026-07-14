import { getVehicle } from '$lib/data/vehicles';
import { getHistoryEntry, deleteHistoryEntry } from '$lib/data/history';
import { getClassifications } from '$lib/data/classifications';
import { decode, validate, encode } from '$lib/utils/formData';
import { withActionErrors } from '$lib/utils/actions';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { recordFormSchema } from '../../schemas';
import type { PageServerLoad } from './$types';
import { deleteAttachment, uploadRecord } from '$lib/data/multipart';

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
		const parsed = await validate(decode(formData), recordFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		// Process deletions BEFORE update so the multipart PUT doesn't include them.
		const toDelete = (formData.get('attachments_to_delete')?.toString() ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		const body = encode({ record: parsed.data });

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
