import { AxiosInstance } from 'axios';
import { MutateParams } from './config';

export interface RecordParams {
    id?: API.RecordID;
    date?: string;
    cost?: string | null;
    mileage?: number;
    notes?: string;
    recordType?: API.RecordType;
}

export const recordsAPIPath = (vehicleId: API.RecordID, share?: boolean) =>
    `/api/vehicles/${vehicleId}/records${share ? '/share' : ''}`;
export const recordAPIPath = (
    vehicleId: API.RecordID,
    recordId: API.RecordID,
) => `/api/vehicles/${vehicleId}/records/${recordId}`;

export async function fetchRecords(
    api: AxiosInstance,
    vehicleId: API.RecordID,
) {
    const { data } = await api.get<API.Record[]>(recordsAPIPath(vehicleId));
    return data;
}

export async function fetchRecord(
    api: AxiosInstance,
    vehicleId: API.RecordID,
    recordId: API.RecordID,
) {
    const { data } = await api.get<API.Record>(
        recordAPIPath(vehicleId, recordId),
    );
    return data;
}

export async function createRecord(
    api: AxiosInstance,
    vehicleId: API.RecordID,
    record: RecordParams,
) {
    const { data } = await api.post<API.Record>(
        recordsAPIPath(vehicleId),
        record,
    );
    return data;
}

export async function updateRecord(
    api: AxiosInstance,
    vehicleId: API.RecordID,
    record: MutateParams<RecordParams>,
) {
    const { data } = await api.put<API.Record>(
        recordAPIPath(vehicleId, record.id),
        record,
    );
    return data;
}

export async function destroyRecord(
    api: AxiosInstance,
    vehicleId: API.RecordID,
    recordId: API.RecordID,
) {
    const { data } = await api.delete(recordAPIPath(vehicleId, recordId));
    return data;
}

export async function createOrUpdateRecord(
    api: AxiosInstance,
    vehicleId: API.RecordID,
    params: RecordParams,
) {
    if (params.id) {
        return updateRecord(
            api,
            vehicleId,
            params as MutateParams<typeof params>,
        );
    }
    return createRecord(api, vehicleId, params);
}
