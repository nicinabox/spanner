import { describe, it, expect, vi } from 'vitest';
import { mockFetch, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { params: { id: '1' }, url: 'http://test.com/vehicles/1' };

describe('actions.toggleRetire', () => {
	it('fetches the vehicle then sends a PUT to toggle retired', async () => {
		const fetchSpy = mockFetch({ id: 1, retired: false })
			.mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, retired: false })))
			.mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, retired: true })));

		await actions.toggleRetire(fakeEvent(new FormData(), route));

		expect(fetchSpy).toHaveBeenCalledTimes(2);

		const getCall = fetchSpy.mock.calls[0];
		expect(getCall[0].toString()).toMatch(/\/vehicles\/1$/);

		const putCall = fetchSpy.mock.calls[1];
		expect(putCall[0].toString()).toMatch(/\/vehicles\/1$/);
		expect(putCall[1]?.method).toBe('PUT');
		expect(JSON.parse(putCall[1]?.body as string)).toEqual({ retired: true });
	});
});

describe('actions.toggleShare', () => {
	it('fetches the vehicle then sends a PUT to toggle sharing', async () => {
		const fetchSpy = mockFetch({ id: 1, preferences: { enableSharing: false } })
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ id: 1, preferences: { enableSharing: false } })),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ id: 1, preferences: { enableSharing: true } })),
			);

		await actions.toggleShare(fakeEvent(new FormData(), route));

		expect(fetchSpy).toHaveBeenCalledTimes(2);

		const putCall = fetchSpy.mock.calls[1];
		expect(putCall[0].toString()).toMatch(/\/vehicles\/1$/);
		expect(putCall[1]?.method).toBe('PUT');
		expect(JSON.parse(putCall[1]?.body as string)).toEqual({
			preferences: { enable_sharing: true },
		});
	});
});
