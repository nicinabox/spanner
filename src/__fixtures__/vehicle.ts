const vehicleFixture: API.Vehicle = {
    id: 1111,
    name: 'Vehicle Fixture',
    vin: '',
    squishVin: '',
    notes: '',
    position: 0,
    distanceUnit: 'mi',
    createdAt: '2019-03-16T05:00:00.000Z',
    milesPerDay: 0,
    milesPerYear: 0,
    estimatedMileage: 0,
    retired: false,
    color: null,
    reminders: [] as API.Reminder[],
    preferences: {
        enableSharing: false,
        enableCost: true,
        sendReminderEmails: true,
        sendPromptForRecords: true,
        showMileageAdjustmentRecords: true,
    },
};

export default vehicleFixture;
