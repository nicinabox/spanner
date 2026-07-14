import * as v from 'valibot';
import type { FormError } from './form';

function issueToFormError(issue: v.BaseIssue<unknown>): FormError {
	const path =
		issue.path
			?.map((p) => (typeof p === 'string' ? p : 'key' in p ? p.key : String(p)))
			.join('.') ?? 'form';
	return { id: path, title: issue.message };
}
