import { VehicleReminder } from 'queries/reminders';
import { Vehicle } from 'queries/vehicles';

const vehicleFixture: Vehicle = {
    id: 1111,
    name: 'Vehicle Fixture',
    vin: '',
    squishVin: '',
    notes: '',
    position: 0,
    enableCost: true,
    distanceUnit: 'mi',
    createdAt: '2019-03-16T05:00:00.000Z',
    milesPerDay: 0,
    milesPerYear: 0,
    estimatedMileage: 0,
    retired: false,
    color: null,
    reminders: [] as VehicleReminder[],
};

export default vehicleFixture;
