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

export type CreatableFields<
	T,
	R extends keyof Omit<T, NonUpdatableFields> = keyof Omit<T, NonUpdatableFields>
> = Pick<T, R>;

export type UpdatableFields<T> = Partial<Omit<T, NonUpdatableFields>>;

const tokenAuthHeader = (token: string | undefined) => (token ? `Token ${token}` : undefined);

export class HTTPError<T = string> extends Error {
	data: T;

	constructor(response: Response, data: T) {
		super('');
		this.name = 'HTTPError';

		this.message = `HTTP Error: ${response.status}`;
		this.data = data;
	}
}

const deserialize = <T>(data: unknown) => {
	try {
		return camelcaseKeys(JSON.parse(data as string)) as T;
	} catch (err) {
		return data as T;
	}
};

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
		const data = await response.text();

		if (!response.ok) {
			throw new HTTPError(response, deserialize(data));
		}

		if (data) {
			return deserialize<T>(data);
		}

		return data as T;
	};
}
