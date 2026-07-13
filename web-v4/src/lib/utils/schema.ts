import * as v from 'valibot';
import type { FormError } from './form';

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

	const result = v.safeParse(schema, entries);
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
