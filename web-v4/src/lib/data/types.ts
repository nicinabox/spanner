export type Transport = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface FetcherConfig {
	baseURI?: string;
	authHeaderValue?: (token: string | undefined) => string | undefined;
	headers?: Record<string, string>;
	throwOnHTTPErrors?: boolean;
}

export interface RequestContext {
	authToken?: string;
	webUrl?: string;
	json?: Record<string, unknown>;
	params?: Record<string, string | number | boolean | undefined | null>;
}

export type RequestOpts = RequestInit & RequestContext;

export type NonUpdatableFields = 'id' | 'createdAt' | 'updatedAt';

export type CreatableFields<
	T,
	R extends keyof Omit<T, NonUpdatableFields> = keyof Omit<T, NonUpdatableFields>,
> = Pick<T, R>;

export type UpdatableFields<T> = Partial<Omit<T, NonUpdatableFields>>;
