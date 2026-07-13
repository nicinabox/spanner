import * as v from 'valibot';
import type { FormError } from './form';

/**
 * Nest a flat FormData-style entries object so dotted/bracket keys
 * (`preferences.enableCost`, `record[date]`) become nested objects.
 * Mirrors the behavior of the legacy `decode` helper.
 */
function nestEntries(entries: Record<string, unknown>): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [rawKey, value] of Object.entries(entries)) {
		const keys = rawKey.split(/[.[\]]+/).filter(Boolean);
		let cursor: Record<string, unknown> = result;
		for (let i = 0; i < keys.length; i++) {
			const part = keys[i];
			if (i === keys.length - 1) {
				cursor[part] = value;
			} else {
				cursor[part] = cursor[part] && typeof cursor[part] === 'object' ? cursor[part] : {};
				cursor = cursor[part] as Record<string, unknown>;
			}
		}
	}
	return result;
}

export function parseForm<TSchema extends v.GenericSchema>(
	formData: FormData,
	schema: TSchema,
):
	| { data: v.InferOutput<TSchema>; errors?: undefined }
	| { data?: undefined; errors: FormError[] } {
	const entries: Record<string, unknown> = {};
	for (const [key, value] of formData.entries()) {
		// Keep the last value when a key appears multiple times.
		entries[key] = value;
	}

	const result = v.safeParse(schema, nestEntries(entries));
	if (result.success) {
		return { data: result.output };
	}

	return { errors: result.issues.map(issueToFormError) };
}

function issueToFormError(issue: v.BaseIssue<unknown>): FormError {
	const path =
		issue.path
			?.map((p) => (typeof p === 'string' ? p : 'key' in p ? p.key : String(p)))
			.join('.') ?? 'form';
	return { id: path, title: issue.message };
}
