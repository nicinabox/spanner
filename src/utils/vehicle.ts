import { Vehicle } from "queries/vehicles";
import { formatNumber } from "./number";

export function formatMileage(mileage: number, distanceUnit: string) {
    return `${formatNumber(mileage)} ${distanceUnit}`;
}

export function formatEstimatedMileage(vehicle: Vehicle) {
    return formatMileage(vehicle.estimatedMileage, vehicle.distanceUnit);
}

export function formatMilesPerYear(vehicle: Vehicle) {
    return `${formatMileage(vehicle.milesPerYear, vehicle.distanceUnit)}`;
}
