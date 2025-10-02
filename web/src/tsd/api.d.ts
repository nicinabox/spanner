declare namespace API {
    type RecordID = string | number;

    type Sortable = [VehicleSortStrategy, Order];

    type Order = 'asc' | 'desc';

    type DistanceUnit = 'mi' | 'km' | 'hr';

    type RecordType = 'mileage adjustment';

    type Record = {
        id: number;
        vehicleId: number;
        date: string;
        cost: string | null;
        mileage: number | null;
        notes: string;
        createdAt: string;
        updatedAt: string;
        recordType: RecordType | null;
    };

    export type ReminderType = '' | 'date_or_mileage' | 'mileage' | 'date';

    type Reminder = {
        id: number;
        notes: string;
        createdAt: string;
        updatedAt: string;
        date: string | null;
        mileage: number | null;
        reminderType: ReminderType | null;
        reminderDate: string | null;
    };

    export interface Session {
        id: string;
        userId: string;
        email: string;
        description: string;
        ip: string;
        lastSeen: string;
        userAgent: string;
        authToken: string;
    }

    type User = {
        id: number;
        email: string;
        createdAt: string;
        updatedAt: string;
        timeZoneOffset: string | null;
        preferences: {
            vehiclesSortOrder: Sortable;
        };
    };

    interface VehiclePreferences {
        enableSharing: boolean;
        enableCost: boolean;
        sendReminderEmails: boolean;
        sendPromptForRecords: boolean;
        showMileageAdjustmentRecords: boolean;
    }

    interface Vehicle {
        id: number;
        name: string;
        vin: string | null;
        notes: string;
        position: number | null;
        distanceUnit: DistanceUnit;
        retired: boolean;
        createdAt: string;
        milesPerDay: number | null;
        milesPerYear: number | null;
        estimatedMileage: number;
        squishVin: string | null;
        reminders: API.Reminder[];
        color: string | null;
        preferences: VehiclePreferences;
    }
}
