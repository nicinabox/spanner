import type { HistoryEntry } from '$lib/data/history';
import Fuse from 'fuse.js';

const MIN_QUERY_LENGTH = 2;

const dateTokens = (raw: string): string[] => {
	try {
		const d = new Date(raw);
		return [
			raw.slice(0, 10),
			d.getFullYear().toString(),
			d.toLocaleDateString('en-US', { month: 'long' }),
			d.toLocaleDateString('en-US', { month: 'short' }),
		];
	} catch {
		return [raw];
	}
};

const mileageTokens = (m: number | null): string[] => {
	if (m == null) return [];
	const rounded1k = Math.round(m / 1000) * 1000;
	const rounded5k = Math.round(m / 5000) * 5000;
	const floor10k = Math.floor(m / 10_000) * 10000;
	return [
		m.toString(),
		m.toLocaleString(),
		`${Math.round(rounded5k / 1000)}k`,
		`${Math.round(floor10k / 1000)}k`,
		rounded1k.toString(),
		rounded5k.toString(),
		floor10k.toString(),
	];
};

const buildHistoryFuse = (history: HistoryEntry[]) =>
	new Fuse(history, {
		useTokenSearch: true,
		tokenMatch: 'all',
		keys: [
			'notes',
			'cost',
			{ name: 'mileage', getFn: (item: HistoryEntry) => mileageTokens(item.mileage) },
			{ name: 'date', getFn: (item: HistoryEntry) => dateTokens(item.date) },
		],
		threshold: 0.3,
		minMatchCharLength: MIN_QUERY_LENGTH,
		ignoreLocation: true,
	});

export { buildHistoryFuse };

export const createHistorySearch = (getHistory: () => HistoryEntry[]) => {
	let query = $state('');

	const fuse = $derived(buildHistoryFuse(getHistory()));
	const filtered = $derived(
		query.length < MIN_QUERY_LENGTH ? getHistory() : fuse.search(query).map((r) => r.item),
	);

	return {
		get query() {
			return query;
		},
		set query(v: string) {
			query = v;
		},
		get filtered() {
			return filtered;
		},
		get minQueryLength() {
			return MIN_QUERY_LENGTH;
		},
	};
};
