import { getVehicle } from '$lib/data/vehicles';
import { createHistoryEntry } from '$lib/data/history';
import { uploadRecord, toMultipartFormData } from '$lib/data/multipart';
import { createVehicleReminder, deleteReminder } from '$lib/data/reminders';
import { decode } from '$lib/utils/form';
import { getHTTPErrors } from '$lib/utils/actions';
import { validateAttachmentFile } from '$lib/utils/file-validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);

	if (vehicle.retired) {
		redirect(303, `/vehicles/${params.id}`);
	}

	return { vehicle };
};

export const actions = {
	record: async ({ request, locals, params, url }) => {
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

		const reminderId = url.searchParams.get('reminder_id');

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
			await uploadRecord(params.id!, undefined, body, locals);
			if (reminderId) {
				await deleteReminder(params.id!, reminderId, locals);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Upload failed';
			return fail(422, {
				errors: [{ id: 'form', title: message }]
			});
		}

		redirect(303, `/vehicles/${params.id}`);
	},

	reminder: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData, {
			notes: 'string',
			reminderType: 'string',
			date: 'string',
			mileage: 'number'
		});

		if (!data.notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Note is required' }] });
		}

		try {
			await createVehicleReminder(
				params.id!,
				{
					notes: data.notes as string,
					reminderType: (data.reminderType as string) || null,
					date: (data.date as string) || null,
					mileage: typeof data.mileage === 'number' ? data.mileage : null
				} as never,
				locals
			);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}/reminders`);
	},

	'mileage-adjustment': async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData, { mileage: 'number' });

		if (typeof data.mileage !== 'number') {
			return fail(400, { errors: [{ id: 'mileage', title: 'Mileage is required' }] });
		}

		// Mileage-only adjustment doesn't expose attachment UI, so keep the JSON path.
		await createHistoryEntry(
			params.id!,
			{
				date: new Date().toISOString().split('T')[0],
				notes: 'Mileage adjustment',
				mileage: data.mileage,
				recordType: 'mileage adjustment'
			} as never,
			locals
		);

		redirect(303, `/vehicles/${params.id}`);
	}
} satisfies Actions;
