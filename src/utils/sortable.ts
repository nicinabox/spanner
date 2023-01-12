import { orderBy } from 'lodash';

import { getOverdueRemindersCount } from './reminders';

export type VehicleSortStrategy =
    | 'created_at'
    | 'name'
    | 'reminders'
    | 'mileage'
    | 'mileage_rate';

export const vehicleSortStrategy: Record<
VehicleSortStrategy,
(vehicles: API.Vehicle[], order: API.Order) => API.Vehicle[]
> = {
    created_at: sortByCreatedAt,
    name: sortByName,
    reminders: sortByReminders,
    mileage: sortByMileage,
    mileage_rate: sortByMileageRate,
};

export const vehicleSortStrategyToHuman: Record<VehicleSortStrategy, string> = {
    name: 'Name',
    created_at: 'Created',
    reminders: 'Reminders',
    mileage: 'Mileage',
    mileage_rate: 'Mileage Rate',
};

export const vehicleSortOrderToHuman: Record<VehicleSortStrategy, [string, string]> = {
    created_at: ['Oldest', 'Newest'],
    name: ['A to Z', 'Z to A'],
    reminders: ['Fewest', 'Most'],
    mileage: ['Lowest', 'Highest'],
    mileage_rate: ['Lowest', 'Highest'],
};

export const orderToHuman = ([sortStrategy, order]: API.Sortable) => {
    const [asc, desc] = vehicleSortOrderToHuman[sortStrategy];
    const options = { asc, desc };
    return options[order];
};

export function sortByCreatedAt(vehicles: API.Vehicle[], order: API.Order) {
    return orderBy(vehicles, (v) => new Date(v.createdAt).getTime(), order);
}

export function sortByName(vehicles: API.Vehicle[], order: API.Order) {
    return orderBy(vehicles, 'name', order);
}

export function sortByReminders(vehicles: API.Vehicle[], order: API.Order) {
    return orderBy(vehicles, [getOverdueRemindersCount, 'name'], [order, 'asc']);
}

export function sortByMileage(vehicles: API.Vehicle[], order: API.Order) {
    return orderBy(vehicles, [(v) => v.estimatedMileage ?? 0, 'name'], [order, 'asc']);
}

export function sortByMileageRate(vehicles: API.Vehicle[], order: API.Order) {
    return orderBy(vehicles, (v) => v.milesPerYear ?? 0, order);
}
