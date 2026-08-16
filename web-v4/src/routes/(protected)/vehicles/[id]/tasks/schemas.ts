import { numberSchema } from '$lib/schemas';
import * as v from 'valibot';

export const serviceScheduleFormSchema = v.object({
	classificationId: v.optional(numberSchema),
	name: v.optional(v.string(''), ''),
	keywords: v.optional(v.string(''), ''),
	distanceInterval: v.optional(numberSchema),
	monthInterval: v.optional(numberSchema),
});

export const scheduleDeferFormSchema = v.object({
	months: v.optional(numberSchema),
	distance: v.optional(numberSchema),
});
