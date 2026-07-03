import { command } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import type { ShareLink } from './share-links';
import * as v from 'valibot';

export const getShareLinks = command(
	v.object({
		vehicleId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	}),
	async ({ vehicleId }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);
		return request<ShareLink[]>(`/vehicles/${vehicleId}/share_links`, { authToken: token });
	},
);

export const createShareLink = command(
	v.object({
		vehicleId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	}),
	async ({ vehicleId }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);
		return request<ShareLink>(`/vehicles/${vehicleId}/share_links`, {
			method: 'POST',
			authToken: token,
		});
	},
);

export const deleteShareLink = command(
	v.object({
		vehicleId: v.pipe(v.number(), v.integer(), v.minValue(1)),
		linkId: v.pipe(v.number(), v.integer(), v.minValue(1)),
	}),
	async ({ vehicleId, linkId }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);
		return request<void>(`/vehicles/${vehicleId}/share_links/${linkId}`, {
			method: 'DELETE',
			authToken: token,
		});
	},
);
