import { getTime } from './date';
import { formatNumber } from './number';
import { diffMileage } from './records';

export function formatMileage(mileage: number | null, distanceUnit: API.DistanceUnit = 'mi') {
    return `${formatNumber(mileage ?? 0)} ${distanceUnit}`;
}

export function formatEstimatedMileage(vehicle: API.Vehicle) {
    return formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit);
}

export function formatMilesPerYear(vehicle: API.Vehicle) {
    return `${formatMileage(vehicle.milesPerYear, vehicle.distanceUnit)}`;
}

export function sortRecordsNewestFirst(records: API.Record[]) {
    return [...records].sort((a, b) => {
        const byDate = getTime(b.date) - getTime(a.date);
        if (byDate) return byDate;
        return diffMileage(b.mileage, a.mileage) || getTime(b.createdAt) - getTime(a.createdAt);
    });
}

export function sortRecordsOldestFirst(records: API.Record[]) {
    return [...records].sort((a, b) => {
        const byDate = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (byDate) return byDate;
        return diffMileage(a.mileage, b.mileage);
    });
}
