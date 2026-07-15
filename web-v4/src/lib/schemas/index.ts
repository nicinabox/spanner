import * as v from 'valibot';

export const numberSchema = v.pipe(
	v.string(),
	v.transform((input) => (input === '' ? undefined : Number(input))),
	v.optional(v.number()),
);

export const booleanSchema = v.pipe(v.fallback(v.string(), 'false'), v.parseBoolean());
