import { numberSchema } from '$lib/schemas';
import * as v from 'valibot';

export const reminderFormSchema = v.object({
	notes: v.pipe(v.string('Note is required'), v.minLength(1, 'Note is required')),
	reminderType: v.optional(v.string(''), ''),
	date: v.optional(v.string(''), ''),
	mileage: v.nullish(numberSchema, null),
});
