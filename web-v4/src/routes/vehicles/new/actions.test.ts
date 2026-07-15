import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { url: 'http://test.com/vehicles/new' };

describe('actions.createVehicle', () => {
	it('returns 422 when name is missing', async () => {
		const result = await actions.createVehicle(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a POST to /vehicles', async () => {
		const fetchSpy = mockFetch({ id: 5 });

		const fd = new FormData();
		fd.append('name', 'My Car');
		fd.append('distanceUnit', 'mi');
		fd.append('color', 'Red');
		fd.append('preferences[enableCost]', 'on');
		fd.append('preferences[sendReminderEmails]', 'on');
		fd.append('preferences[sendPromptForRecords]', 'on');
		fd.append('preferences[showMileageAdjustmentRecords]', 'on');

		await actions.createVehicle(fakeEvent(fd, route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/vehicles$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({
			name: 'My Car',
			vin: '',
			color: 'Red',
			distance_unit: 'mi',
			preferences: {
				enable_cost: true,
				send_reminder_emails: true,
				send_prompt_for_records: true,
				show_mileage_adjustment_records: true,
			},
		});
	});
});
