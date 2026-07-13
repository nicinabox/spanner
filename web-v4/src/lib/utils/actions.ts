import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';
import type { FormError } from './form';
import type { RequestEvent } from '@sveltejs/kit';

export const getHTTPErrors = (error: unknown): { errors: FormError[] } => {
	if (error instanceof HTTPError && error.status === 401) {
		throw redirect(307, '/');
	}
	if (error instanceof HTTPError) {
		return error.data;
	}
	return { errors: [{ id: 'form', title: 'An unexpected error occurred' }] };
};

/**
 * Validate a single required field on parsed form data. Returns a fail-shaped
 * error response (for use with `return fail(400, ...)`) or null.
 */
export function requireField(
	data: Record<string, unknown>,
	key: string,
	message: string,
): { errors: FormError[] } | null {
	if (data[key]) return null;
	return { errors: [{ id: key, title: message }] };
};

type FormActionEvent = RequestEvent & { request: Request };

/**
 * Wrap a SvelteKit action handler with the standard error pipeline. The
 * handler keeps its full return type via the `TResult` generic, so
 * downstream `form?.x` reads stay type-safe.
 *
 * Catches any error the handler throws (other than SvelteKit `redirect`),
 * converts it via `getHTTPErrors`, and returns `fail(422, ...)`. The handler
 * is responsible for parsing FormData, schema validation, and any
 * `requireField` checks.
 */
export function withActionErrors<TResult>(
	handler: (event: FormActionEvent) => Promise<TResult>,
): (event: FormActionEvent) => Promise<TResult | ReturnType<typeof fail<{ errors: FormError[] }>>> {
	return async (event) => {
		try {
			return await handler(event);
		} catch (e) {
			if (isRedirect(e)) throw e;
			return fail(422, getHTTPErrors(e));
		}
	};
}
