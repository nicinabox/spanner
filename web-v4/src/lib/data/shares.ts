import { request } from './server';
import type { RequestOpts } from './types';

export interface VehicleShare {
  id: number;
  vehicle_id: number;
  user_id: number;
  invited_by_id: number;
  accepted_at: string | null;
  created_at: string;
  user?: { id: number; email: string };
  invited_by?: { id: number; email: string };
  vehicle?: { id: number; name: string };
}

export const createShare = (vehicleId: number, email: string, opts: RequestOpts) => {
  return request<VehicleShare>(`/vehicles/${vehicleId}/shares`, {
    ...opts,
    method: 'POST',
    json: { email },
  });
};

export const getShares = (vehicleId: number, opts: RequestOpts) => {
  return request<VehicleShare[]>(`/vehicles/${vehicleId}/shares`, opts);
};

export const deleteShare = (vehicleId: number, shareId: number, opts: RequestOpts) => {
  return request<void>(`/vehicles/${vehicleId}/shares/${shareId}`, {
    ...opts,
    method: 'DELETE',
  });
};

export const getPendingShares = (opts: RequestOpts) => {
  return request<VehicleShare[]>('/shares/pending', opts);
};

export const acceptShare = (shareId: number, opts: RequestOpts) => {
  return request<VehicleShare>(`/shares/${shareId}/accept`, {
    ...opts,
    method: 'POST',
  });
};

export const declineShare = (shareId: number, opts: RequestOpts) => {
  return request<void>(`/shares/${shareId}/decline`, {
    ...opts,
    method: 'DELETE',
  });
};
