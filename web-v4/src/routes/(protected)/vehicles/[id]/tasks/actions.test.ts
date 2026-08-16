import { describe, it, expect, vi } from 'vitest';
import { mockFetch, mockFetchError, formDataFrom, fakeEvent } from '$lib/utils/test';
import { actions } from './+page.server';

vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));
vi.mock('$app/env', () => ({ browser: false }));

const route = { params: { id: '1' }, url: 'http://test.com/vehicles/1/tasks' };

describe('actions.complete', () => {
	it('returns 422 when id is missing from form data', async () => {
		const result = await actions.complete(fakeEvent(formDataFrom({ notes: 'Oil change' }), route));

		expect(result).toMatchObject({
			status: 422,
			data: {
				errors: expect.arrayContaining([
					expect.objectContaining({ id: expect.stringMatching(/id/) }),
				]),
			},
		});
	});

	it('sends a POST to create a history record with encoded form data', async () => {
		const fetchSpy = mockFetch({ id: 99 }, 201);

		await actions
			.complete(fakeEvent(formDataFrom({ id: '42', notes: 'Oil change', mileage: '50000' }), route))
			.catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/vehicles\/1\/records$/);
		expect(call[1]?.method).toBe('POST');

		const body = call[1]?.body as FormData;
		expect(body).toBeInstanceOf(FormData);
		expect(Array.from(body.entries())).toContainEqual(['record[notes]', 'Oil change']);
		expect(Array.from(body.entries())).toContainEqual(['record[mileage]', '50000']);
	});

	it('sends a POST to complete the schedule with the new record id', async () => {
		const fetchSpy = mockFetch({ id: 99 }, 201);

		await actions
			.complete(fakeEvent(formDataFrom({ id: '42', notes: 'Oil change' }), route))
			.catch(() => {});

		const call = fetchSpy.mock.calls[1];
		expect(call[0].toString()).toMatch(/\/vehicles\/1\/service_schedules\/42\/complete$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ record_id: 99 });
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422, { error: 'Validation failed' });

		const result = await actions.complete(
			fakeEvent(formDataFrom({ id: '42', notes: 'Oil change' }), route),
		);

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'Validation failed' }] },
		});
	});
});

describe('actions.defer', () => {
	it('returns 422 when id is missing', async () => {
		const result = await actions.defer(fakeEvent(formDataFrom({ months: '6' }), route));

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'Missing schedule id' }] },
		});
	});

	it('sends a POST to defer the schedule with months and distance', async () => {
		const fetchSpy = mockFetch({ id: 99 });

		await actions
			.defer(fakeEvent(formDataFrom({ id: '42', months: '6', distance: '5000' }), route))
			.catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/vehicles\/1\/service_schedules\/42\/defer$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({ months: 6, distance: 5000 });
	});

	it('sends a POST with empty body when only id is provided', async () => {
		const fetchSpy = mockFetch({ id: 99 });

		await actions.defer(fakeEvent(formDataFrom({ id: '42' }), route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(JSON.parse(call[1]?.body as string)).toEqual({});
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422, { error: 'Defer failed' });

		const result = await actions.defer(fakeEvent(formDataFrom({ id: '42', months: '6' }), route));

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'Defer failed' }] },
		});
	});
});

describe('actions.clearDefer', () => {
	it('returns 422 when id is missing', async () => {
		const result = await actions.clearDefer(fakeEvent(new FormData(), route));

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'Missing schedule id' }] },
		});
	});

	it('sends a DELETE to clear the deferral', async () => {
		const fetchSpy = mockFetch({ id: 99 });

		await actions.clearDefer(fakeEvent(formDataFrom({ id: '42' }), route)).catch(() => {});

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/vehicles\/1\/service_schedules\/42\/defer$/);
		expect(call[1]?.method).toBe('DELETE');
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422, { error: 'Clear failed' });

		const result = await actions.clearDefer(fakeEvent(formDataFrom({ id: '42' }), route));

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'Clear failed' }] },
		});
	});
});

describe('actions.suggest', () => {
	it('returns 422 when distanceUnit is missing', async () => {
		const result = await actions.suggest(
			fakeEvent(
				formDataFrom({
					presetData: JSON.stringify([
						{ name: 'Oil change', intervals: { mi: 5000, mo: 6 }, keywords: [] },
					]),
				}),
				route,
			),
		);

		expect(result).toMatchObject({ status: 422 });
	});

	it('returns 422 when presetData is not valid JSON', async () => {
		const result = await actions.suggest(
			fakeEvent(formDataFrom({ distanceUnit: 'mi', presetData: 'not-json' }), route),
		);

		expect(result).toMatchObject({ status: 422 });
	});

	it('sends a POST to the batch endpoint with mapped schedules', async () => {
		const fetchSpy = mockFetch([{ id: 1 }, { id: 2 }]);

		const result = await actions.suggest(
			fakeEvent(
				formDataFrom({
					distanceUnit: 'mi',
					presetData: JSON.stringify([
						{ name: 'Oil change', intervals: { mi: 5000, mo: 6 }, keywords: ['oil'] },
						{ name: 'Tires', intervals: { mi: 10000 }, keywords: ['tire', 'rotate'] },
					]),
				}),
				route,
			),
		);

		expect(result).toEqual({ success: true });

		const call = fetchSpy.mock.calls[0];
		expect(call[0].toString()).toMatch(/\/vehicles\/1\/service_schedules\/batch$/);
		expect(call[1]?.method).toBe('POST');
		expect(JSON.parse(call[1]?.body as string)).toEqual({
			service_schedule: [
				{
					classification_name: 'Oil change',
					keywords: ['oil'],
					distance_interval: 5000,
					month_interval: 6,
				},
				{ classification_name: 'Tires', keywords: ['tire', 'rotate'], distance_interval: 10000 },
			],
		});
	});

	it('returns 422 when the API returns an error', async () => {
		mockFetchError(422, { error: 'Suggest failed' });

		const result = await actions.suggest(
			fakeEvent(
				formDataFrom({
					distanceUnit: 'mi',
					presetData: JSON.stringify([
						{ name: 'Oil change', intervals: { mi: 5000, mo: 6 }, keywords: [] },
					]),
				}),
				route,
			),
		);

		expect(result).toMatchObject({
			status: 422,
			data: { errors: [{ id: 'form', title: 'Suggest failed' }] },
		});
	});
});
