import type { DistanceUnit, Vehicle } from '$lib/data/vehicles';
import { formatNumber } from './number';

export function formatMileage(mileage: number | null, distanceUnit: DistanceUnit = 'mi') {
	return `${formatNumber(mileage ?? 0)} ${distanceUnit}`;
}

export function formatEstimatedMileage(vehicle: Vehicle) {
	return formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit);
}

export function formatMilesPerYear(vehicle: Vehicle) {
	return `${formatMileage(vehicle.milesPerYear, vehicle.distanceUnit)}/yr`;
}
