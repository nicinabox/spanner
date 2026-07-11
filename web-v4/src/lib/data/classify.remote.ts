import { command } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import * as v from 'valibot';

export interface ClassificationResult {
	classification: {
		id: number;
		key: string | null;
		name: string;
		system: boolean;
		vehicleId: number | null;
		keywords: string[];
	};
	classifier: string;
	confidence: number;
}

export const classifyNotes = command(
	v.object({
		notes: v.pipe(v.string(), v.nonEmpty()),
		vehicleId: v.number(),
	}),
	async ({ notes, vehicleId }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);

		return request<ClassificationResult[]>(
			`/vehicles/${vehicleId}/classify?notes=${encodeURIComponent(notes)}`,
			{ authToken: token },
		);
	},
);