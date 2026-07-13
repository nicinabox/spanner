import * as v from 'valibot';

export const serviceScheduleFormSchema = v.object({
	classificationId: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	name: v.optional(v.string(''), ''),
	keywords: v.optional(v.string(''), ''),
	distanceInterval: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	monthInterval: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
});

export const scheduleDeferFormSchema = v.object({
	months: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	distance: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
});
