import { VehicleRecord } from 'queries/records';
import { Vehicle } from 'queries/vehicles';
import { formatNumber } from './number';

export function formatMileage(mileage: number | null, distanceUnit: string) {
    return `${formatNumber(mileage ?? 0)} ${distanceUnit}`;
}

export function formatEstimatedMileage(vehicle: Vehicle) {
    return formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit);
}

export function formatMilesPerYear(vehicle: Vehicle) {
    return `${formatMileage(vehicle.milesPerYear, vehicle.distanceUnit)}`;
}

export function sortRecordsNewestFirst(records: VehicleRecord[]) {
    return records.sort((a, b) => {
        const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (byDate) return byDate;
        return b.mileage - a.mileage;
    });
}

export function sortRecordsOldestFirst(records: VehicleRecord[]) {
    return records.sort((a, b) => {
        const byDate = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (byDate) return byDate;
        return a.mileage - b.mileage;
    });
}
