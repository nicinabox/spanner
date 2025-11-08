export type LogEntryType = 'mileage adjustment';

export interface LogEntry {
	id: number;
	vehicleId: number;
	date: string;
	cost: string | null;
	mileage: number | null;
	notes: string;
	createdAt: string;
	updatedAt: string;
	recordType: LogEntryType | null;
}
