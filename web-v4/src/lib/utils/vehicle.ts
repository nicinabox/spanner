import type { DistanceUnit, Vehicle } from '$lib/data/vehicles';
import { formatNumber } from './number';
import lang from './lang';

export function mileageLabel(distanceUnit: DistanceUnit) {
	return lang.mileageLabel[distanceUnit];
}

export function MileageLabel(distanceUnit: DistanceUnit) {
	const label = mileageLabel(distanceUnit);
	return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMileage(mileage: number | null, distanceUnit: DistanceUnit = 'mi') {
	return `${formatNumber(mileage ?? 0)} ${distanceUnit}`;
}

export function formatEstimatedMileage(vehicle: Vehicle) {
	return formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit);
}

export function formatMilesPerYear(vehicle: Vehicle) {
	return `${formatMileage(vehicle.milesPerYear, vehicle.distanceUnit)}/yr`;
}
