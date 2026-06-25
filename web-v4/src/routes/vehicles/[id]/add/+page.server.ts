import { getVehicle } from '$lib/data/vehicles';
import { createHistoryEntry } from '$lib/data/history';
import { uploadRecord, nestRecordFields } from '$lib/data/multipart';
import { createVehicleReminder } from '$lib/data/reminders';
import { decode } from '$lib/utils/form';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions = {
	record: async ({ request, locals, params }) => {
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

		try {
			const nested = nestRecordFields(formData);
			await uploadRecord(params.id!, undefined, nested, locals);
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
