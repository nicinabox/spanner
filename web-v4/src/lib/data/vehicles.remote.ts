import { command } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import * as v from 'valibot';

export const exportVehicle = command(
	v.object({
		vehicleId: v.pipe(v.string(), v.nonEmpty()),
	}),
	async ({ vehicleId }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);

		return request<string>(`/vehicles/${vehicleId}/export`, {
			authToken: token,
		});
	},
);
