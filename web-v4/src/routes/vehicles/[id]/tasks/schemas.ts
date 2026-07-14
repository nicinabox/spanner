import { numberSchema } from '$lib/schemas';
import * as v from 'valibot';

export const serviceScheduleFormSchema = v.object({
	classificationId: v.nullish(numberSchema, null),
	name: v.optional(v.string(''), ''),
	keywords: v.optional(v.string(''), ''),
	distanceInterval: v.nullish(numberSchema, null),
	monthInterval: v.nullish(numberSchema, null),
});

export const scheduleDeferFormSchema = v.object({
	months: v.nullish(numberSchema, null),
	distance: v.nullish(numberSchema, null),
});
