import { Vehicle } from "queries/vehicles";
import { formatNumber } from "./number";

export function formatEstimatedMilage(vehicle: Vehicle) {
    return `${formatNumber(vehicle.estimatedMileage)} ${vehicle.distanceUnit}`;
}

export function formatMilesPerYear(vehicle: Vehicle) {
    return `${formatNumber(vehicle.milesPerYear)} ${vehicle.distanceUnit}`;
}
