export const apiConfig = {
	baseUrl: process.env.PROXY_HOST,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/vnd.api+json; version=2'
	}
};
