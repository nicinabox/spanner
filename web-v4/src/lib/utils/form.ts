import { invalidateAll } from '$app/navigation';
import type { SubmitFunction } from '@sveltejs/kit';

export interface FormError {
	id: string;
	title: string;
}

export const createInlineEnhance = ({
	onSuccess,
	onError,
}: { onSuccess?: () => void; onError?: () => void } = {}): SubmitFunction => {
	return () =>
		async ({ result, update }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				await invalidateAll();
				onSuccess?.();
			} else {
				update();
				onError?.();
			}
		};
};

export const enhanceInline = createInlineEnhance();

/**
 * Split a FormData key into nesting segments. Accepts both dot notation
 * (`preferences.enableCost`) and Rails-style bracket notation (`record[date]`).
 * Empty segments (from a trailing `[...]`) are dropped.
 */
function splitKey(key: string): string[] {
	return key.split(/[.[\]]+/).filter(Boolean);
}

export function decode(
	formData: FormData,
	schema?: Record<string, 'boolean' | 'string' | 'number'>,
) {
	const decodeValue = (value: FormDataEntryValue) => {
		if (!value) return '';
		if (value === 'true' || value === 'on') return true;
		if (value === 'false') return false;
		if (!isNaN(Number(value))) return Number(value);
		return value;
	};

	const result: Record<string, any> = {};

	for (const [key, value] of formData.entries()) {
		const keys = splitKey(key);
		let current = result;

		for (let i = 0; i < keys.length; i++) {
			const part = keys[i];
			if (i === keys.length - 1) {
				current[part] = decodeValue(value);
			} else {
				current[part] = current[part] || {};
				current = current[part];
			}
		}
	}

	if (schema) {
		for (const [key, type] of Object.entries(schema)) {
			if (type === 'boolean') {
				const keys = splitKey(key);
				let current = result;
				for (let i = 0; i < keys.length; i++) {
					const part = keys[i];
					if (i === keys.length - 1) {
						if (!(part in current)) {
							current[part] = false;
						}
					} else {
						current[part] = current[part] || {};
						current = current[part];
					}
				}
			}
		}
	}

	return result;
}
