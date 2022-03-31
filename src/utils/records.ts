import { toNumber } from 'lodash';
import { getTime } from './date';

export const diffMileage = (m1: number | null, m2: number | null) => {
    return toNumber(m1) - toNumber(m2);
};

export const sortRecordsNewestFirst = (a: API.Record, b: API.Record) => {
    const byDate = getTime(b.date) - getTime(a.date);
    if (byDate) return byDate;
    return diffMileage(b.mileage, a.mileage) || getTime(b.createdAt) - getTime(a.createdAt);
};

export const sortRecordsOldestFirst = (a: API.Record, b: API.Record) => {
    const byDate = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (byDate) return byDate;
    return diffMileage(b.mileage, a.mileage);
};

export const getNewestRecord = (records: API.Record[]) => {
    return records.sort(sortRecordsNewestFirst)[0];
};
