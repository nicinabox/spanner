import { VehicleRecord } from 'queries/records';
import { getTime } from './date';

export const sortRecordsNewestFirst = (a: VehicleRecord, b: VehicleRecord) => {
    const byDate = getTime(b.date) - getTime(a.date);
    if (byDate) return byDate;
    return b.mileage - a.mileage || getTime(b.createdAt) - getTime(a.createdAt);
};

export const sortRecordsOldestFirst = (a: VehicleRecord, b: VehicleRecord) => {
    const byDate = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (byDate) return byDate;
    return a.mileage - b.mileage;
};

export const getNewestRecord = (records: VehicleRecord[]) => {
    return records.sort(sortRecordsNewestFirst)[0];
};
