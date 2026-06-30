import type { DistanceUnit } from '$lib/data/vehicles';

export default {
	mileageLong: {
		mi: 'mile',
		km: 'kilometer',
		hr: 'hour',
		nmi: 'nautical mile',
	},

	mileageLabel: {
		mi: 'mileage',
		km: 'mileage',
		hr: 'service time',
		nmi: 'nautical mileage',
	},
} as const satisfies Record<string, Record<DistanceUnit, string>>;
