import type { HistoryEntry } from '$lib/data/history';

export const getNextRecordWithMileage = (
	record: HistoryEntry,
	history: HistoryEntry[]
): HistoryEntry | undefined => {
	const currIdx = history.findIndex((r) => r.id === record.id);
	let idx = currIdx + 1;
	let nextRecord;

	while (idx < history.length) {
		if (history[idx]?.mileage) {
			nextRecord = history[idx];
			break;
		}
		idx += 1;
	}

	return nextRecord;
};

export const getDeltaMileage = (
	record: HistoryEntry | undefined,
	olderRecord: HistoryEntry | undefined
): number => {
	if (!record || !olderRecord) return 0;
	return Math.max((record.mileage ?? 0) - (olderRecord.mileage ?? 0), 0);
};

export const calculateDeltaMileage = (record: HistoryEntry, history: HistoryEntry[]): number => {
	const nextRecord = getNextRecordWithMileage(record, history);
	return getDeltaMileage(record, nextRecord);
};
