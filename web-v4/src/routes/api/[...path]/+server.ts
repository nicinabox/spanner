import { apiConfig } from '$lib/data/config';
import { getAuthToken } from '$lib/utils/session';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, request, cookies }) => {
	const token = await getAuthToken(cookies);
	return proxy(params.path, request, token);
};

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	const token = await getAuthToken(cookies);
	return proxy(params.path, request, token);
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	const token = await getAuthToken(cookies);
	return proxy(params.path, request, token);
};

export const DELETE: RequestHandler = async ({ params, request, cookies }) => {
	const token = await getAuthToken(cookies);
	return proxy(params.path, request, token);
};

async function proxy(path: string, request: Request, token: string | undefined) {
	const url = new URL(path, apiConfig.baseUrl);
	url.search = new URL(request.url).search;
	const headers = new Headers();

	for (const [key, value] of request.headers) {
		if (!['host', 'cookie', 'content-length', 'accept'].includes(key.toLowerCase())) {
			headers.set(key, value);
		}
	}

	for (const [key, value] of Object.entries(apiConfig.headers)) {
		headers.set(key, value);
	}

	if (token) {
		headers.set('Authorization', `Token ${token}`);
	}

	const body = request.body ? await request.bytes() : undefined;

	const response = await fetch(url, {
		method: request.method,
		headers,
		body,
	});

	return new Response(response.body, {
		status: response.status,
		headers: response.headers,
	});
}
