import { PROXY_HOST } from '$env/static/private';

export const apiConfig = {
	baseUrl: PROXY_HOST,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/vnd.api+json; version=2'
	}
};
