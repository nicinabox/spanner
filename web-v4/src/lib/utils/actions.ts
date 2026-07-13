import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';
import { parseForm } from './schema';
import type { FormError } from './form';
import type { RequestEvent } from '@sveltejs/kit';
import type { GenericSchema, InferOutput } from 'valibot';

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
}

type FormActionEvent = RequestEvent & { request: Request };

/**
 * Wrap a SvelteKit action with the standard pipeline: parse FormData, validate
 * against a valibot schema, run the handler, and convert thrown API errors
 * into fail(422) responses. Redirects thrown from the handler pass through.
 */
export function withFormAction<TSchema extends GenericSchema>(
	handler: (data: InferOutput<TSchema>, event: FormActionEvent) => Promise<unknown>,
	schema: TSchema,
): (event: FormActionEvent) => Promise<unknown>;
export function withFormAction(
	handler: (data: Record<string, FormDataEntryValue>, event: FormActionEvent) => Promise<unknown>,
): (event: FormActionEvent) => Promise<unknown>;
export function withFormAction(
	handler: (data: any, event: FormActionEvent) => Promise<unknown>,
	schema?: GenericSchema,
) {
	return async (event: FormActionEvent) => {
		const formData = await event.request.formData();
		if (schema) {
			const parsed = parseForm(formData, schema);
			if (parsed.errors) {
				return fail(422, { errors: parsed.errors });
			}
			try {
				return await handler(parsed.data as never, event);
			} catch (e) {
				if (isRedirect(e)) throw e;
				return fail(422, getHTTPErrors(e));
			}
		}
		const data = Object.fromEntries(formData);
		try {
			return await handler(data, event);
		} catch (e) {
			if (isRedirect(e)) throw e;
			return fail(422, getHTTPErrors(e));
		}
	};
}
