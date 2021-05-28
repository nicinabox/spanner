import { RecordID } from 'queries/config';

export const vehiclesPath = () => '/vehicles';

export const newVehiclePath = () => `${vehiclesPath()}/new`;

export const vehiclePath = (vehicleId: RecordID) => `${vehiclesPath()}/${vehicleId}`;

export const editVehiclePath = (vehicleId: RecordID) => `${vehiclePath(vehicleId)}/edit`;

export const vehicleAddPath = (vehicleId: RecordID) => `${vehiclePath(vehicleId)}/add`;

export const vehicleImportPath = (vehicleId: RecordID) => `${vehiclePath(vehicleId)}/import`;

export const editRecordPath = (vehicleId: RecordID, recordId: RecordID) => `${vehiclePath(vehicleId)}/records/${recordId}/edit`;

export const reminderPath = (vehicleId: RecordID, reminderId: RecordID) => `${vehiclePath(vehicleId)}/reminders/${reminderId}`;

export const editReminderPath = (vehicleId: RecordID, reminderId: RecordID) => `${reminderPath(vehicleId, reminderId)}/edit`;
