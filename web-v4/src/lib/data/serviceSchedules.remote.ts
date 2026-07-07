import { query } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import * as v from 'valibot';

export interface PresetItem {
	name: string;
	intervals: Record<string, number>;
	keywords: string[];
}

export interface PresetGroup {
	name: string;
	distanceUnit: string | string[];
	items: PresetItem[];
}

export const getPresets = query(
	v.object({ distanceUnit: v.optional(v.string()) }),
	async ({ distanceUnit }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);

		return request<Record<string, PresetGroup>>('/service_schedules/presets', {
			authToken: token,
			params: {
				distance_unit: distanceUnit,
			},
		});
	},
);
