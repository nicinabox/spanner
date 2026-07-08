import { getVehicle } from '$lib/data/vehicles';
import { createHistoryEntry } from '$lib/data/history';
import { uploadRecord, toMultipartFormData } from '$lib/data/multipart';
import { createVehicleReminder, deleteReminder } from '$lib/data/reminders';
import { getClassifications, createClassification } from '$lib/data/classifications';
import { createServiceSchedule } from '$lib/data/serviceSchedules';
import { decode } from '$lib/utils/form';
import { getHTTPErrors } from '$lib/utils/actions';
import { validateAttachments } from '$lib/utils/file-validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);

	if (vehicle.retired) {
		redirect(303, `/vehicles/${params.id}`);
	}

	const classifications = await getClassifications(params.id!, locals);

	return { vehicle, classifications };
};

export const actions = {
	record: async ({ request, locals, params, url }) => {
		const formData = await request.formData();

		// Read classification_ids before decode to avoid FormData iterator issues
		const classificationIds = formData.getAll('record[classification_ids][]');

		const data = decode(formData, {
			date: 'string',
			notes: 'string',
			mileage: 'number',
			cost: 'number',
		});

		if (!data.date) {
			return fail(400, { errors: [{ id: 'date', title: 'Date is required' }] });
		}
		if (!data.notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Notes is required' }] });
		}

		const reminderId = url.searchParams.get('reminder_id');

		const files = formData.getAll('record[attachments][]') as File[];

		const validation = await validateAttachments(files);
		if (!validation.valid) {
			return fail(422, {
				errors: [{ id: 'attachments', title: validation.reason }],
			});
		}

		const body = toMultipartFormData(
			{
				date: data.date,
				notes: data.notes,
				mileage: typeof data.mileage === 'number' ? data.mileage : null,
				cost: typeof data.cost === 'number' ? data.cost : null,
			},
			{ prefix: 'record' },
		);
		for (const file of files) {
			body.append('record[attachments][]', file);
		}
		for (const id of classificationIds) {
			body.append('record[classification_ids][]', id);
		}

		try {
			await uploadRecord(params.id!, undefined, body, locals);
			if (reminderId) {
				await deleteReminder(params.id!, reminderId, locals);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Upload failed';
			return fail(422, {
				errors: [{ id: 'form', title: message }],
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
			mileage: 'number',
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
					mileage: typeof data.mileage === 'number' ? data.mileage : null,
				} as never,
				locals,
			);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}/tasks`);
	},

	'mileage-adjustment': async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData, { mileage: 'number' });

		if (typeof data.mileage !== 'number') {
			return fail(400, { errors: [{ id: 'mileage', title: 'Mileage is required' }] });
		}

		await createHistoryEntry(
			params.id!,
			{
				date: new Date().toISOString().split('T')[0],
				notes: 'Mileage adjustment',
				mileage: data.mileage,
				recordType: 'mileage adjustment',
			} as never,
			locals,
		);

		redirect(303, `/vehicles/${params.id}`);
	},

	schedule: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData, {
			classificationId: 'number',
			newName: 'string',
			keywords: 'string',
			distanceInterval: 'number',
			monthInterval: 'number',
			notes: 'string',
		});

		let classificationId = data.classificationId;
		const newName = data.newName;

		if (!classificationId && !newName) {
			return fail(400, {
				errors: [{ id: 'classificationId', title: 'Select or create a service' }],
			});
		}

		if (!data.distanceInterval && !data.monthInterval) {
			return fail(400, {
				errors: [{ id: 'form', title: 'Set a distance or month interval' }],
			});
		}

		if (newName) {
			const keywords = (data.keywords || '')
				.split(',')
				.map((k: string) => k.trim())
				.filter(Boolean);
			const classification = await createClassification(
				params.id!,
				{ classification: { name: newName, keywords } },
				locals,
			);
			classificationId = classification.id;
		}

		await createServiceSchedule(
			params.id!,
			{
				serviceSchedule: {
					classificationId: classificationId,
					distanceInterval: data.distanceInterval || null,
					monthInterval: data.monthInterval || null,
					notes: data.notes || null,
				},
			},
			locals,
		);

		redirect(303, `/vehicles/${params.id}/tasks`);
	},
} satisfies Actions;
