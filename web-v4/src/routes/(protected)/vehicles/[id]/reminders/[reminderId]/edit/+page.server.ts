import { getVehicle } from '$lib/data/vehicles';
import { getReminder, updateReminder, deleteReminder } from '$lib/data/reminders';
import { withActionErrors } from '$lib/utils/actions';
import { decode, validate } from '$lib/utils/formData';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { reminderFormSchema } from '../../schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const [vehicle, reminder] = await Promise.all([
		getVehicle(params.id!, locals),
		getReminder(params.id!, params.reminderId!, locals),
	]);

	return { vehicle, reminder };
};

export const actions = {
	update: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), reminderFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await updateReminder(
			params.id!,
			params.reminderId!,
			{
				notes: parsed.data.notes,
				reminderType: parsed.data.reminderType,
				date: parsed.data.date,
				mileage: parsed.data.mileage,
			},
			locals,
		);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	delete: withActionErrors(async ({ locals, params }) => {
		await deleteReminder(params.id!, params.reminderId!, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),
} satisfies Actions;
