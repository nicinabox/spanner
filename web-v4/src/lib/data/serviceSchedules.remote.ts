import { query } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import * as v from 'valibot';

interface Preset {
	name: string;
	distance_interval: number | null;
	month_interval: number | null;
}

export const getPresets = query(v.object({}), async () => {
	const event = getRequestEvent();
	const token = await getAuthToken(event.cookies);

	return request<Record<string, Preset[]>>('/service_schedules/presets', {
		authToken: token,
	});
});
