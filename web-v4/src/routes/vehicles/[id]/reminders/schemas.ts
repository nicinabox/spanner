import * as v from 'valibot';

export const reminderFormSchema = v.object({
	notes: v.pipe(v.string('Note is required'), v.minLength(1, 'Note is required')),
	reminderType: v.optional(v.string(''), ''),
	date: v.optional(v.string(''), ''),
	mileage: v.nullish(
		v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))),
		null,
	),
});
