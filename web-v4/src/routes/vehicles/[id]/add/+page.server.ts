import { getVehicle } from '$lib/data/vehicles';
import { createReminder } from '$lib/data/reminders';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const notes = formData.get('notes')?.toString();
		const reminderType = formData.get('reminderType')?.toString() ?? '';
		const date = formData.get('date')?.toString();
		const mileage = formData.get('mileage')?.toString();

		if (!notes) {
			return fail(400, { errors: [{ id: 'notes', title: 'Note is required' }] });
		}

		await createReminder(
			{
				notes,
				reminderType: reminderType || null,
				date: date || null,
				mileage: mileage ? Number(mileage) : null
			} as never,
			locals
		);

		redirect(303, `/vehicles/${params.id}/reminders`);
	}
} satisfies Actions;
