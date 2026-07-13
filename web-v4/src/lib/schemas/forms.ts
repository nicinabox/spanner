import * as v from 'valibot';

/**
 * Boolean schema for HTML form checkboxes. Coerces the common checkbox
 * values (`"on"`, `"off"`, `"true"`, `"false"`, `true`, `false`) to
 * `true`/`false`, matching the behavior of the legacy `decode` helper.
 *
 * The default `false` handles missing fields (unchecked checkboxes don't
 * submit anything).
 */
export const booleanForm = v.optional(
	v.pipe(
		v.union([
			v.literal('on'),
			v.literal('off'),
			v.literal('true'),
			v.literal('false'),
			v.boolean(),
		]),
		v.transform((value) => value === true || value === 'on' || value === 'true'),
	),
	false,
);
