import * as v from 'valibot';

export const numberSchema = v.pipe(v.string(), v.transform(Number), v.number());

export const booleanSchema = v.pipe(v.fallback(v.string(), 'false'), v.parseBoolean());
