import { API_URL } from '$app/env/private';
import { createAPIRequest, apiHeaders } from './client';

export const apiConfig = {
	baseURI: API_URL,
	headers: apiHeaders,
	throwOnHTTPErrors: true,
};

export const request = createAPIRequest(apiConfig);
