import { API_URL } from '$app/env/private';
import type { RequestOpts } from './client';
import { HTTPError } from './client';

const ACCEPT_HEADER = 'application/vnd.api+json; version=2';

/**
 * Build a multipart FormData from a flat record object, wrapping each key
 * under an optional `prefix[...]` so the backend can read it via strong
 * params (`params.require(:prefix).permit(...)`). Undefined/null values
 * are skipped.
 */
export function toMultipartFormData(
	entries: Record<string, unknown>,
	options: { prefix?: string } = {},
): FormData {
	const { prefix } = options;
	const out = new FormData();
	for (const [key, value] of Object.entries(entries)) {
		if (value === undefined || value === null) continue;
		const name = prefix ? `${prefix}[${key}]` : key;
		out.append(name, String(value));
	}
	return out;
}

export async function uploadRecord(
	vehicleId: string | number,
	recordId: string | number | undefined,
	formData: FormData,
	opts: RequestOpts,
): Promise<unknown> {
	const path = recordId
		? `${API_URL}/vehicles/${vehicleId}/records/${recordId}`
		: `${API_URL}/vehicles/${vehicleId}/records`;
	const headers = new Headers({ Accept: ACCEPT_HEADER });
	if (opts.authToken) {
		headers.set('Authorization', `Token ${opts.authToken}`);
	}

	const response = await fetch(path, {
		method: recordId ? 'PUT' : 'POST',
		body: formData,
		headers,
	});

	const text = await response.text();
	if (!response.ok) {
		const data = text ? safeParse(text) : text;
		throw new HTTPError(response, data);
	}
	return text ? safeParse(text) : text;
}

export async function deleteAttachment(
	vehicleId: string | number,
	recordId: string | number,
	signedId: string,
	opts: RequestOpts,
): Promise<void> {
	const headers = new Headers({ Accept: ACCEPT_HEADER });
	if (opts.authToken) {
		headers.set('Authorization', `Token ${opts.authToken}`);
	}

	const response = await fetch(
		`${API_URL}/vehicles/${vehicleId}/records/${recordId}/attachments/${signedId}`,
		{ method: 'DELETE', headers },
	);

	if (!response.ok) {
		const text = await response.text();
		const data = text ? safeParse(text) : text;
		throw new HTTPError(response, data);
	}
}

export async function importRecords(
	vehicleId: string | number,
	formData: FormData,
	opts: RequestOpts,
): Promise<void> {
	const headers = new Headers({ Accept: ACCEPT_HEADER });
	if (opts.authToken) {
		headers.set('Authorization', `Token ${opts.authToken}`);
	}

	const response = await fetch(`${API_URL}/vehicles/${vehicleId}/import`, {
		method: 'POST',
		headers,
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		const data = text ? safeParse(text) : text;
		throw new HTTPError(response, data);
	}
}

function safeParse(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
