import { getVehicle } from '$lib/data/vehicles';
import { getReminder, updateReminder, deleteReminder } from '$lib/data/reminders';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PageServerLoad } from './$types';

export const reminderFormSchema = v.object({
	notes: v.pipe(v.string('Note is required'), v.minLength(1, 'Note is required')),
	reminderType: v.optional(v.string(''), ''),
	date: v.optional(v.string(''), ''),
	mileage: v.nullish(
		v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))),
		null,
	),
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const reminder = await getReminder(params.id!, params.reminderId!, locals);

	return { vehicle, reminder };
};

export const actions = {
	update: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, reminderFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await updateReminder(
			params.id!,
			params.reminderId!,
			{
				notes: parsed.data.notes,
				reminderType: parsed.data.reminderType || null,
				date: parsed.data.date || null,
				mileage: parsed.data.mileage ?? null,
			} as never,
			locals,
		);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	delete: withActionErrors(async ({ locals, params }) => {
		await deleteReminder(params.id!, params.reminderId!, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),
} satisfies Actions;
