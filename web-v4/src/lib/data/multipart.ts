import { PROXY_HOST } from '$env/static/private';
import type { RequestOpts } from './client';
import { HTTPError } from './client';

const ACCEPT_HEADER = 'application/vnd.api+json; version=2';

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
