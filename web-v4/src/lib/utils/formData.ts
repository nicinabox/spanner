import * as v from 'valibot';
import type { FormError } from './form';
import snakeCaseKeys from 'snakecase-keys';

/**
 * Decode FormData to a nested object.
 * Handles Rails-style keys: record[field], field[], record[items][]
 *
 * Example:
 *   Input:  record[date]=x, record[notes]=y, classificationIds[]=1, classificationIds[]=2
 *   Output: { record: { date: 'x', notes: 'y' }, classificationIds: ['1', '2'] }
 */
export function decode(formData: FormData): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	// Group keys by root (first segment before any [)
	const groups = new Map<string, { path: string[]; isArray: boolean }>();

	for (const key of formData.keys()) {
		const isArray = key.endsWith('[]');
		const base = key.slice(0, isArray ? -2 : undefined);
		const path = base
			.split('[')
			.map((p) => p.replace(']', ''))
			.filter(Boolean);

		if (path.length > 0) {
			groups.set(key, { path, isArray });
		} else {
			// Simple key
			result[key] = formData.get(key);
		}
	}

	// Process grouped keys
	for (const [key, { path, isArray }] of groups) {
		const root = path[0]!;
		const nested = path.slice(1);

		const values = isArray
			? (formData.getAll(key) as string[]).filter((v) => v !== '')
			: [formData.get(key)];

		const value = isArray ? values : values[0];

		if (nested.length === 0) {
			result[root] = value;
		} else {
			setIn(result, [root, ...nested], value);
		}
	}

	return result;
}

function setIn(obj: Record<string, unknown>, path: string[], value: unknown): void {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i]!;
		if (!current[key] || typeof current[key] !== 'object') {
			current[key] = {};
		}
		current = current[key] as Record<string, unknown>;
	}
	current[path[path.length - 1]!] = value;
}

/**
 * Encode a nested object to FormData for multipart upload.
 * Key names are converted from camelCase to snake_case for Rails compatibility.
 *
 * Example:
 *   encode({ record: { date: '2024-01-15', attachments: [file1, file2] } })
 *   // → FormData with: record[date]=..., record[attachments]=file1, record[attachments]=file2
 */
export function encode<T extends Record<string, unknown>>(data: T): FormData {
	const out = new FormData();

	function append(key: string, value: unknown): void {
		if (value === undefined || value === null) return;

		if (Array.isArray(value)) {
			for (const item of value) {
				if (item !== undefined && item !== null) {
					append(`${key}[]`, item);
				}
			}
		} else if (typeof value === 'object' && !(value instanceof File)) {
			for (const [nestedKey, nestedValue] of Object.entries(value)) {
				append(`${key}[${nestedKey}]`, nestedValue);
			}
		} else if (value instanceof File) {
			out.append(key, value);
		} else {
			out.append(key, String(value));
		}
	}

	for (const [key, value] of Object.entries(snakeCaseKeys(data))) {
		append(key, value);
	}

	return out;
}

/**
 * Validate data against a valibot schema.
 * Returns parsed data on success, or array of form errors on failure.
 */
export async function validate<Data, TSchema extends v.GenericSchema | v.GenericSchemaAsync>(
	data: Data,
	schema: TSchema,
) {
	const result = await v.safeParseAsync(schema, data);
	if (result.success) {
		return { data: result.output };
	}

	const errors: FormError[] = result.issues.map((issue) => {
		const path =
			issue.path
				?.map((p) => (typeof p === 'string' ? p : 'key' in p ? p.key : String(p)))
				.join('.') ?? 'form';
		return { id: path, title: issue.message };
	});

	return { errors };
}
