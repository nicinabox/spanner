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

export function requireField(
	data: Record<string, unknown>,
	key: string,
	message: string,
): { errors: FormError[] } | null {
	if (data[key]) return null;
	return { errors: [{ id: key, title: message }] };
};

type FormActionEvent = RequestEvent & { request: Request };

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
