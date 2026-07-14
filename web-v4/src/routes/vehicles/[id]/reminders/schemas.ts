import { numberSchema } from '$lib/schemas';
import * as v from 'valibot';
import type { ReminderType } from '$lib/data/reminders';

export const reminderFormSchema = v.object({
	notes: v.pipe(v.string('Note is required'), v.minLength(1, 'Note is required')),
	reminderType: v.optional(
		v.picklist(['', 'date_or_mileage', 'mileage', 'date'] as const satisfies ReminderType[]),
		'',
	),
	reminderDate: v.nullish(v.string(''), ''),
	date: v.optional(v.string(''), ''),
	mileage: v.nullish(numberSchema, null),
});
