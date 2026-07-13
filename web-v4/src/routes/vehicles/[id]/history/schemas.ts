import { numberSchema } from '$lib/schemas';
import * as v from 'valibot';

export const recordFormSchema = v.object({
	date: v.pipe(v.string('Date is required'), v.minLength(1, 'Date is required')),
	notes: v.pipe(v.string('Notes is required'), v.minLength(1, 'Notes is required')),
	mileage: v.nullish(numberSchema, null),
	cost: v.nullish(numberSchema, null),
});
