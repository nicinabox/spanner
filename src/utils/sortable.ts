import { orderBy, sortBy } from 'lodash';

import { Vehicle } from 'queries/vehicles';
import { getOverdueRemindersCount } from './reminders';

export type VehicleSortStrategy =
    | 'newest_first'
    | 'oldest_first'
    | 'reminders_first'
    | 'highest_mileage_first'
    | 'lowest_mileage_first'
    | 'highest_mileage_rate_first'
    | 'lowest_mileage_rate_first';

export const vehicleSortStrategy: Record<VehicleSortStrategy, (vehicles: Vehicle[]) => Vehicle[]> = {
    newest_first: sortVehiclesNewestFirst,
    oldest_first: sortVehiclesOldestFirst,
    reminders_first: sortVehiclesRemindersFirst,
    highest_mileage_first: sortVehiclesHighestMileageFirst,
    lowest_mileage_first: sortVehiclesLowestMileageFirst,
    highest_mileage_rate_first: sortVehiclesHighestMileageRateFirst,
    lowest_mileage_rate_first: sortVehiclesLowestMileageRateFirst,
};

export function sortVehiclesNewestFirst(vehicles: Vehicle[]) {
    return orderBy(vehicles, (v) => new Date(v.createdAt).getTime(), 'desc');
}

export function sortVehiclesOldestFirst(vehicles: Vehicle[]) {
    return orderBy(vehicles, (v) => new Date(v.createdAt).getTime(), 'asc');
}

export function sortVehiclesRemindersFirst(vehicles: Vehicle[]) {
    return orderBy(vehicles, getOverdueRemindersCount, 'desc');
}

export function sortVehiclesHighestMileageFirst(vehicles: Vehicle[]) {
    return orderBy(vehicles, (v) => v.estimatedMileage ?? 0, 'desc');
}

export function sortVehiclesLowestMileageFirst(vehicles: Vehicle[]) {
    return orderBy(vehicles, (v) => v.estimatedMileage ?? 0, 'asc');
}

export function sortVehiclesHighestMileageRateFirst(vehicles: Vehicle[]) {
    return orderBy(vehicles, (v) => v.milesPerYear ?? 0, 'desc');
}

export function sortVehiclesLowestMileageRateFirst(vehicles: Vehicle[]) {
    return orderBy(vehicles, (v) => v.milesPerYear ?? 0, 'asc');
}
