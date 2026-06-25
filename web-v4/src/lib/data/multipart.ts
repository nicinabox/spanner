import { PROXY_HOST } from '$env/static/private';
import type { RequestOpts } from './client';
import { HTTPError } from './client';

const ACCEPT_HEADER = 'application/vnd.api+json; version=2';

/**
 * Wrap flat form fields under `record[...]` so the Rails backend's strong
 * params (`params.require(:record).permit(...)`) see them nested.
 * Entries already starting with `record[` are passed through unchanged.
 * Entries in `skip` are dropped (e.g. `attachments_to_delete`, which the
 * SvelteKit action handles separately via the DELETE endpoint).
 */
export function nestRecordFields(source: FormData, skip: string[] = []): FormData {
	const skipSet = new Set(skip);
	const out = new FormData();
	for (const [key, value] of source.entries()) {
		if (skipSet.has(key)) continue;
		if (key.startsWith('record[')) {
			out.append(key, value);
		} else {
			out.append(`record[${key}]`, value);
		}
	}
	return out;
}

export async function uploadRecord(
	vehicleId: string | number,
	recordId: string | number | undefined,
	formData: FormData,
	opts: RequestOpts
): Promise<unknown> {
	const path = recordId
		? `${PROXY_HOST}/vehicles/${vehicleId}/records/${recordId}`
		: `${PROXY_HOST}/vehicles/${vehicleId}/records`;
	const headers = new Headers({ Accept: ACCEPT_HEADER });
	if (opts.authToken) {
		headers.set('Authorization', `Token ${opts.authToken}`);
	}

	const response = await fetch(path, {
		method: recordId ? 'PUT' : 'POST',
		body: formData,
		headers
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
	opts: RequestOpts
): Promise<void> {
	const headers = new Headers({ Accept: ACCEPT_HEADER });
	if (opts.authToken) {
		headers.set('Authorization', `Token ${opts.authToken}`);
	}

	const response = await fetch(
		`${PROXY_HOST}/vehicles/${vehicleId}/records/${recordId}/attachments/${signedId}`,
		{ method: 'DELETE', headers }
	);

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
