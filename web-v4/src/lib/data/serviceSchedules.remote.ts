import { query } from '$app/server';
import { request } from './server';
import * as v from 'valibot';

interface Preset {
	name: string;
	distance_interval: number | null;
	month_interval: number | null;
}

export const getPresets = query(v.object({}), async () => {
	return request<Record<string, Preset[]>>('/service_schedules/presets', {});
});
