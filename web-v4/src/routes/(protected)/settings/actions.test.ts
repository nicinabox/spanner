import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { url: 'http://test.com/settings' };

describe('actions.changeEmail', () => {
	it('returns 422 when email is missing', async () => {
		const result = await actions.changeEmail(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('returns 422 when email is invalid', async () => {
		const result = await actions.changeEmail(
			fakeEvent(formDataFrom({ email: 'not-an-email' }), route),
		);

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a POST to /user/email_change', async () => {
		const fetchSpy = mockFetch({});

		await actions.changeEmail(fakeEvent(formDataFrom({ email: 'new@b.com' }), route));

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/user\/email_change$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ user: { email: 'new@b.com' } });
	});

	it('returns success with the new email', async () => {
		mockFetch({});

		const result = await actions.changeEmail(
			fakeEvent(formDataFrom({ email: 'new@b.com' }), route),
		);

		expect(result).toEqual({ emailSuccess: true, email: 'new@b.com' });
	});
});

describe('actions.changePassword', () => {
	it('returns 422 when password is missing', async () => {
		const result = await actions.changePassword(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('returns 422 when passwords do not match', async () => {
		const result = await actions.changePassword(
			fakeEvent(formDataFrom({ password: 'Secret1!', confirmPassword: 'Different1!' }), route),
		);

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a PUT to /password', async () => {
		const fetchSpy = mockFetch({});

		await actions.changePassword(
			fakeEvent(formDataFrom({ password: 'NewSecret1!', confirmPassword: 'NewSecret1!' }), route),
		);

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/password$/);
		expect(call[1]?.method).toBe('PUT');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ password: 'NewSecret1!' });
	});

	it('returns success', async () => {
		mockFetch({});

		const result = await actions.changePassword(
			fakeEvent(formDataFrom({ password: 'NewSecret1!', confirmPassword: 'NewSecret1!' }), route),
		);

		expect(result).toEqual({ passwordSuccess: true });
	});
});

describe('actions.delete', () => {
	it('sends a DELETE to /user', async () => {
		const fetchSpy = mockFetch({});

		await actions.delete(fakeEvent(new FormData(), route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/user$/);
		expect(call[1]?.method).toBe('DELETE');
	});
});

describe('actions.updateWebhook', () => {
	it('sends a PUT to /user with webhook preferences', async () => {
		const fetchSpy = mockFetch({});

		await actions.updateWebhook(
			fakeEvent(formDataFrom({ webhookUrl: 'https://hooks.example.com' }), route),
		);

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/user$/);
		expect(call[1]?.method).toBe('PUT');
		expect(JSON.parse(call[1]?.body as string)).toEqual({
			preferences: { webhook_url: 'https://hooks.example.com' },
		});
	});

	it('returns success with the webhook url', async () => {
		mockFetch({});

		const result = await actions.updateWebhook(
			fakeEvent(formDataFrom({ webhookUrl: 'https://hooks.example.com' }), route),
		);

		expect(result).toEqual({ webhookSuccess: true, webhookUrl: 'https://hooks.example.com' });
	});
});
