import * as v from 'valibot';

export const numberSchema = v.pipe(v.string(), v.transform(Number), v.number());

export const booleanSchema = v.fallback(v.pipe(v.optional(v.string()), v.parseBoolean()), false);
