import camelcaseKeys from 'camelcase-keys';
import { apiConfig } from './config';

export type Transport = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface FetcherConfig {
	baseUrl?: string;
	authHeaderValue?: (token: string | undefined) => string | undefined;
	headers?: Record<string, string>;
}

export interface RequestContext {
	authToken?: string;
}

export type RequestOpts = RequestInit & RequestContext;
export type NonUpdatableFields = 'id' | 'createdAt' | 'updatedAt';
export type CreatableFields<T> = Omit<T, NonUpdatableFields>;
export type UpdatableFields<T> = Partial<CreatableFields<T>>;

const tokenAuthHeader = (token: string | undefined) => (token ? `Token ${token}` : undefined);

export function createAPIRequest(initialConfig: FetcherConfig = apiConfig) {
	const config = {
		authHeaderValue: tokenAuthHeader,
		...initialConfig
	};

	return async function fetcher<T>(endpoint: string, options: RequestOpts = {}): Promise<T> {
		const { authToken, ...init } = options;

		const url = new URL(endpoint, config.baseUrl);
		const headers = new Headers({ ...config.headers, ...options.headers });

		const authHeaderValue = config.authHeaderValue(authToken);
		if (authHeaderValue) {
			headers.set('Authorization', authHeaderValue);
		}

		const response = await fetch(url, { ...init, headers });

		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

		const data = await response.text();

		if (data) {
			return camelcaseKeys(JSON.parse(data)) as T;
		}

		return data as T;
	};
}
