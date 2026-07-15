import { describe, it, expect, vi } from 'vitest';
import { isRedirect } from '@sveltejs/kit';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { params: { token: 'my-token' }, url: 'http://test.com/preferences/my-token' };

describe('actions.update', () => {
	it('returns 422 when vehicleId is missing', async () => {
		const result = await actions.update(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a POST to save preferences', async () => {
		const fetchSpy = mockFetch({});

		await actions.update(
			fakeEvent(
				formDataFrom({
					vehicleId: '1',
					sendReminderEmails: 'on',
					sendPromptForRecords: 'off',
				}),
				route,
			),
		);

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/account\/my-token\/preferences$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({
			vehicle_id: 1,
			send_reminder_emails: true,
			send_prompt_for_records: false,
		});
	});

	it('returns success', async () => {
		mockFetch({});

		const result = await actions.update(
			fakeEvent(
				formDataFrom({
					vehicleId: '1',
					sendReminderEmails: 'on',
					sendPromptForRecords: 'on',
				}),
				route,
			),
		);

		expect(result).toEqual({ success: true });
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422);

		const result = await actions.update(
			fakeEvent(
				formDataFrom({
					vehicleId: '1',
					sendReminderEmails: 'on',
					sendPromptForRecords: 'on',
				}),
				route,
			),
		);

		expect(result).toMatchObject({
			status: 422,
			data: { error: "Couldn't save preferences. Please try again." },
		});
	});
});

describe('actions.unsubscribe', () => {
	it('sends a POST to unsubscribe', async () => {
		const fetchSpy = mockFetch({});

		await actions.unsubscribe(fakeEvent(formDataFrom({ vehicle_id: '1' }), route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/account\/my-token$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ action_type: 'unsubscribe' });
	});

	it('redirects after unsubscribing', async () => {
		mockFetch({});

		try {
			await actions.unsubscribe(fakeEvent(formDataFrom({ vehicle_id: '1' }), route));
			expect.fail('expected redirect');
		} catch (e) {
			expect(isRedirect(e)).toBe(true);
		}
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422);

		const result = await actions.unsubscribe(fakeEvent(formDataFrom({ vehicle_id: '1' }), route));

		expect(result).toMatchObject({
			status: 422,
			data: { error: "Couldn't unsubscribe. Please try again." },
		});
	});
});

describe('actions.reactivate', () => {
	it('sends a POST to reactivate', async () => {
		const fetchSpy = mockFetch({});

		await actions.reactivate(fakeEvent(formDataFrom({ vehicle_id: '1' }), route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/account\/my-token$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ action_type: 'reactivate' });
	});

	it('redirects after reactivating', async () => {
		mockFetch({});

		try {
			await actions.reactivate(fakeEvent(formDataFrom({ vehicle_id: '1' }), route));
			expect.fail('expected redirect');
		} catch (e) {
			expect(isRedirect(e)).toBe(true);
		}
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422);

		const result = await actions.reactivate(fakeEvent(formDataFrom({ vehicle_id: '1' }), route));

		expect(result).toMatchObject({
			status: 422,
			data: { error: "Couldn't reactivate. Please try again." },
		});
	});
});
