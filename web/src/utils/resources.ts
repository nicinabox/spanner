export const vehiclesPath = () => '/vehicles';

export const newVehiclePath = () => `${vehiclesPath()}/new`;

export const vehiclePath = (vehicleId: API.RecordID) =>
    `${vehiclesPath()}/${vehicleId}`;

export const editVehiclePath = (vehicleId: API.RecordID) =>
    `${vehiclePath(vehicleId)}/edit`;

export const vehicleAddPath = (vehicleId: API.RecordID) =>
    `${vehiclePath(vehicleId)}/add`;

export const vehicleImportPath = (vehicleId: API.RecordID) =>
    `${vehiclePath(vehicleId)}/import`;

export const editRecordPath = (
    vehicleId: API.RecordID,
    recordId: API.RecordID,
) => `${vehiclePath(vehicleId)}/records/${recordId}/edit`;

export const reminderPath = (
    vehicleId: API.RecordID,
    reminderId: API.RecordID,
) => `${vehiclePath(vehicleId)}/reminders/${reminderId}`;

export const editReminderPath = (
    vehicleId: API.RecordID,
    reminderId: API.RecordID,
) => `${reminderPath(vehicleId, reminderId)}/edit`;
