import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { params: { id: '1' }, url: 'http://test.com/vehicles/1/edit' };

describe('actions.update', () => {
	it('returns 422 when name is missing', async () => {
		const result = await actions.update(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a PUT to /vehicles/:id', async () => {
		const fetchSpy = mockFetch({ id: 1 });

		const fd = new FormData();
		fd.append('name', 'Updated');
		fd.append('distanceUnit', 'mi');
		fd.append('retired', 'on');
		fd.append('preferences[enableCost]', 'on');
		fd.append('preferences[sendReminderEmails]', 'on');
		fd.append('preferences[sendPromptForRecords]', 'on');
		fd.append('preferences[showMileageAdjustmentRecords]', 'on');

		await actions.update(fakeEvent(fd, route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/vehicles\/1$/);
		expect(call[1]?.method).toBe('PUT');
		expect(JSON.parse(call[1]?.body as string)).toEqual({
			name: 'Updated',
			vin: '',
			color: '',
			distance_unit: 'mi',
			retired: true,
			preferences: {
				enable_cost: true,
				send_reminder_emails: true,
				send_prompt_for_records: true,
				show_mileage_adjustment_records: true,
			},
		});
	});
});

describe('actions.delete', () => {
	it('sends a DELETE to /vehicles/:id', async () => {
		const fetchSpy = mockFetch({});

		await actions.delete(fakeEvent(new FormData(), route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/vehicles\/1$/);
		expect(call[1]?.method).toBe('DELETE');
	});
});
