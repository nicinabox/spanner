import { vi } from 'vitest';

/**
 * Mock global fetch to return a JSON response.
 */
export function mockFetch<T>(data: T, status = 200) {
	return vi
		.spyOn(globalThis, 'fetch')
		.mockResolvedValue(new Response(JSON.stringify(data), { status }));
}

/**
 * Mock global fetch to return an error response.
 */
export function mockFetchError(status: number, body?: unknown) {
	return mockFetch(body ?? '', status);
}

/**
 * Build FormData from a flat object.
 */
export function formDataFrom(obj: Record<string, string>): FormData {
	const fd = new FormData();
	for (const [k, v] of Object.entries(obj)) fd.append(k, v);
	return fd;
}

/**
 * Standard locals for action tests.
 */
export const fakeLocals = {
	authToken: 'test-token',
	webUrl: 'http://test.com',
} as App.Locals;

/**
 * Create a fake SvelteKit request event for action tests.
 * Provide overrides for params, url, locals, or cookies when they vary per route.
 */
export function fakeEvent(
	formData: FormData,
	overrides?: {
		params?: Record<string, string>;
		url?: string;
		locals?: App.Locals;
		cookies?: { set?: ReturnType<typeof vi.fn> };
	},
) {
	return {
		request: { formData: async () => formData },
		locals: overrides?.locals ?? fakeLocals,
		params: overrides?.params ?? {},
		url: new URL(overrides?.url ?? 'http://test.com'),
		cookies: {
			set: overrides?.cookies?.set ?? vi.fn(),
		},
	} as never;
}
