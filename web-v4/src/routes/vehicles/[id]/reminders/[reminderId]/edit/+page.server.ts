import { getVehicle } from '$lib/data/vehicles';
import { getReminder, updateReminder, deleteReminder } from '$lib/data/reminders';
import { getHTTPErrors } from '$lib/utils/actions';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const reminder = await getReminder(params.id!, params.reminderId!, locals);

	return { vehicle, reminder };
};

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const notes = formData.get('notes')?.toString() ?? '';
		const reminderType = formData.get('reminderType')?.toString() ?? '';
		const date = formData.get('date')?.toString();
		const mileage = formData.get('mileage')?.toString();

		if (!notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Note is required' }] });
		}

		try {
			await updateReminder(
				params.id!,
				params.reminderId!,
				{
					notes,
					reminderType: reminderType || null,
					date: date || null,
					mileage: mileage ? Number(mileage) : null
				} as never,
				locals
			);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}/reminders`);
	},

	delete: async ({ locals, params }) => {
		await deleteReminder(params.id!, params.reminderId!, locals);
		redirect(303, `/vehicles/${params.id}/reminders`);
	}
} satisfies Actions;
