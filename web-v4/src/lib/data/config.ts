import { API_URL } from '$env/static/private';

export const apiConfig = {
	baseUrl: API_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/vnd.api+json; version=2',
	},
	throwOnHTTPErrors: true,
};
