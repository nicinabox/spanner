import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

// Markdown reaches $app/env/public via #lib/content.ts, and the type imports pull in
// #lib/data/server.ts ($app/env/private). Both need stubs under vitest.
vi.mock('$app/env/public', () => ({ PUBLIC_UMAMI_CONFIG: '', PUBLIC_CONTACT_EMAIL: '' }));
vi.mock('$app/env/private', () => ({ API_URL: 'http://test.api' }));

import VehiclePrintout from './VehiclePrintout.svelte';
import type { Vehicle } from '#lib/data/vehicles.ts';
import type { HistoryEntry } from '#lib/data/history.ts';

const vehicle: Vehicle = {
	id: 1,
	name: '2014 Toyota Tacoma',
	vin: '5TFJU4GN0EX012345',
	notes: '',
	position: null,
	enableCost: true,
	distanceUnit: 'mi',
	retired: false,
	createdAt: '2024-01-01T00:00:00Z',
	milesPerDay: null,
	milesPerYear: null,
	estimatedMileage: 142000,
	squishVin: null,
	color: null,
	preferences: { enableCost: true },
	reminders: [],
	serviceSchedules: [],
};

function record(
	overrides: Partial<HistoryEntry> & Pick<HistoryEntry, 'id' | 'date'>,
): HistoryEntry {
	return {
		vehicleId: 1,
		cost: null,
		mileage: null,
		notes: '',
		createdAt: `${overrides.date}T00:00:00Z`,
		updatedAt: `${overrides.date}T00:00:00Z`,
		recordType: null,
		attachments: [],
		classifications: [],
		...overrides,
	};
}

const history: HistoryEntry[] = [
	record({ id: 1, date: '2024-06-01', notes: 'Oil change', mileage: 138000, cost: '89.5' }),
	record({ id: 2, date: '2023-05-01', notes: 'Purchase', mileage: 121000 }),
	record({
		id: 3,
		date: '2024-07-01',
		notes: 'Corrected odometer',
		recordType: 'mileage adjustment',
	}),
];

describe('VehiclePrintout', () => {
	it('renders records oldest first, regardless of input order', async () => {
		const { container } = await render(VehiclePrintout, { vehicle, history });
		const items = Array.from(container.querySelectorAll('li')).map(
			(element) => element.textContent ?? '',
		);

		expect(items).toHaveLength(2);
		expect(items[0]).toContain('Purchase');
		expect(items[1]).toContain('Oil change');
	});

	it('groups records under their year', async () => {
		const { container } = await render(VehiclePrintout, { vehicle, history });
		const years = Array.from(container.querySelectorAll('h2')).map(
			(element) => element.textContent,
		);

		expect(years).toEqual(['2023', '2024']);
	});

	it('leaves out mileage adjustments', async () => {
		const { container } = await render(VehiclePrintout, { vehicle, history });

		expect(container.textContent).not.toContain('Corrected odometer');
	});

	it('hides cost when the vehicle disables it', async () => {
		const { container } = await render(VehiclePrintout, {
			vehicle: { ...vehicle, enableCost: false, preferences: { enableCost: false } },
			history,
		});

		expect(container.textContent).not.toContain('$90');
	});

	it('shows the vehicle identity in the header', async () => {
		const { container } = await render(VehiclePrintout, { vehicle, history });

		expect(container.querySelector('h1')?.textContent).toBe('2014 Toyota Tacoma');
		expect(container.textContent).toContain('5TFJU4GN0EX012345');
		expect(container.textContent).toContain('142,000 mi');
	});
});
