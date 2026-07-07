import { query } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import * as v from 'valibot';

export interface PresetItem {
	name: string;
	distanceInterval: number | null;
	monthInterval: number | null;
	keywords: string[];
}

export interface PresetGroup {
	name: string;
	distanceUnit: string;
	items: PresetItem[];
}

export const getPresets = query(v.object({ distanceUnit: v.optional(v.string()) }), async ({ distanceUnit }) => {
	const event = getRequestEvent();
	const token = await getAuthToken(event.cookies);

	const path = distanceUnit
		? `/service_schedules/presets?distance_unit=${distanceUnit}`
		: '/service_schedules/presets';

	return request<Record<string, PresetGroup>>(path, {
		authToken: token,
	});
});
