import { getVehicle } from '$lib/data/vehicles';
import { createHistoryEntry } from '$lib/data/history';
import { uploadRecord } from '$lib/data/multipart';
import { createVehicleReminder } from '$lib/data/reminders';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions = {
	record: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const date = formData.get('date')?.toString();
		const notes = formData.get('notes')?.toString() ?? '';

		if (!date) {
			return fail(400, { errors: [{ id: 'date', title: 'Date is required' }] });
		}
		if (!notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Notes is required' }] });
		}

		try {
			await uploadRecord(params.id!, undefined, formData, locals);
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
		const notes = formData.get('notes')?.toString();
		const reminderType = formData.get('reminderType')?.toString() ?? '';
		const date = formData.get('date')?.toString();
		const mileage = formData.get('mileage')?.toString();

		if (!notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Note is required' }] });
		}

		await createVehicleReminder(
			params.id!,
			{
				notes,
				reminderType: reminderType || null,
				date: date || null,
				mileage: mileage ? Number(mileage) : null
			} as never,
			locals
		);

		redirect(303, `/vehicles/${params.id}/reminders`);
	},

	'mileage-adjustment': async ({ request, locals, params }) => {
		const formData = await request.formData();
		const mileage = formData.get('mileage')?.toString();

		if (!mileage) {
			return fail(400, { errors: [{ id: 'mileage', title: 'Mileage is required' }] });
		}

		// Mileage-only adjustment doesn't expose attachment UI, so keep the JSON path.
		await createHistoryEntry(
			params.id!,
			{
				date: new Date().toISOString().split('T')[0],
				notes: 'Mileage adjustment',
				mileage: Number(mileage),
				recordType: 'mileage adjustment'
			} as never,
			locals
		);

		redirect(303, `/vehicles/${params.id}`);
	}
} satisfies Actions;
