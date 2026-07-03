import { request } from './server';
import type { RequestOpts } from './types';

export interface ShareLink {
  id: number;
  vehicle_id: number;
  token: string;
  created_at: string;
}

export const createShareLink = (vehicleId: number, opts: RequestOpts) => {
  return request<ShareLink>(`/vehicles/${vehicleId}/share_links`, {
    ...opts,
    method: 'POST',
  });
};

export const getShareLinks = (vehicleId: number, opts: RequestOpts) => {
  return request<ShareLink[]>(`/vehicles/${vehicleId}/share_links`, opts);
};

export const deleteShareLink = (vehicleId: number, linkId: number, opts: RequestOpts) => {
  return request<void>(`/vehicles/${vehicleId}/share_links/${linkId}`, {
    ...opts,
    method: 'DELETE',
  });
};
