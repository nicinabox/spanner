import camelcaseKeys from 'camelcase-keys';
import snakeCaseKeys from 'snakecase-keys';
import type { FetcherConfig, RequestOpts } from './types';
import { browser } from '$app/env';

export const apiHeaders = {
	Accept: 'application/vnd.api+json; version=2',
};

const tokenAuthHeader = (token: string | undefined) => (token ? `Token ${token}` : undefined);

export const withBody = (data: FormData | Record<string, any>, namespace?: string) => {
	if (data instanceof FormData) return { body: data };
	return { json: namespace ? { [namespace]: data } : data };
};

/**
 * Current browser UTC offset as a signed number string (e.g. `-5`, `5.5`).
 * `Date#getTimezoneOffset` returns minutes WEST of UTC, hence the negation.
 */
export const getTimeZoneOffset = (): string =>
	((new Date().getTimezoneOffset() / 60) * -1).toString();

export class HTTPError<T = string> extends Error {
	status: number;
	data: T;

	constructor(response: Response, data: T) {
		super('');
		this.name = 'HTTPError';
		this.status = response.status;
		this.message = `HTTP Error: ${response.status}`;
		this.data = data;
	}
}

const deserialize = <T>(data: unknown) => {
	try {
		return camelcaseKeys(JSON.parse(data as string), { deep: true }) as T;
	} catch (err) {
		return data as T;
	}
};

export function createAPIRequest(initialConfig: FetcherConfig) {
	const config = {
		authHeaderValue: tokenAuthHeader,
		baseURI: '',
		...initialConfig,
	};

	return async function fetcher<T>(endpoint: string, options: RequestOpts = {}): Promise<T> {
		const { authToken, webUrl, params, ...init } = options;

		const url = new URL(
			config.baseURI + endpoint,
			browser ? window.location.origin : config.baseURI,
		);

		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (value != null) {
					url.searchParams.set(key, String(value));
				}
			}
		}

		const headers = new Headers({ ...config.headers, ...options.headers });

		const authHeaderValue = config.authHeaderValue(authToken);
		if (authHeaderValue) {
			headers.set('Authorization', authHeaderValue);
		}

		if (webUrl) {
			headers.set('X-Web-URL', webUrl);
		}

		if (options.json) {
			headers.set('Content-Type', 'application/json');
			init.body = JSON.stringify(snakeCaseKeys(options.json));
		}

		const response = await fetch(url, { ...init, headers });
		const data = await response.text();

		if (!response.ok && config.throwOnHTTPErrors) {
			throw new HTTPError(response, deserialize(data));
		}

		if (data) {
			return deserialize<T>(data);
		}

		return data as T;
	};
}
