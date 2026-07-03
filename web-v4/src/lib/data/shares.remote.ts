import { command } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import type { VehicleShare } from './shares';
import * as v from 'valibot';

export const getShares = command(
	v.object({
		vehicleId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	}),
	async ({ vehicleId }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);
		return request<VehicleShare[]>(`/vehicles/${vehicleId}/shares`, { authToken: token });
	},
);

export const createShare = command(
	v.object({
		vehicleId: v.pipe(v.number(), v.integer(), v.minValue(1)),
		email: v.pipe(v.string(), v.email()),
	}),
	async ({ vehicleId, email }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);
		return request<VehicleShare>(`/vehicles/${vehicleId}/shares`, {
			method: 'POST',
			json: { email },
			authToken: token,
		});
	},
);

export const deleteShare = command(
	v.object({
		vehicleId: v.pipe(v.number(), v.integer(), v.minValue(1)),
		shareId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	}),
	async ({ vehicleId, shareId }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);
		return request<void>(`/vehicles/${vehicleId}/shares/${shareId}`, {
			method: 'DELETE',
			authToken: token,
		});
	},
);
