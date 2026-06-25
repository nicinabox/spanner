import { HTTPError } from '$lib/data/client';
import type { FormError } from './form';

export const getHTTPErrors = (error: unknown): { errors: FormError[] } => {
	if (error instanceof HTTPError) {
		return error.data;
	}
	return { errors: ['An unexpected error occurred'] };
};
