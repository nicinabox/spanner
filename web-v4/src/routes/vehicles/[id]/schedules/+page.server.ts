import { getVehicle } from '$lib/data/vehicles';
import {
	getServiceSchedules,
	completeServiceSchedule,
	deleteServiceSchedule,
	createServiceSchedule,
	getPresets,
} from '$lib/data/serviceSchedules';
import { getClassifications, createClassification } from '$lib/data/classifications';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

type SchedulePreset = {
	name: string;
	distanceInterval: number | null;
	monthInterval: number | null;
};

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const [schedules, classifications] = await Promise.all([
		getServiceSchedules(params.id!, locals),
		getClassifications(params.id!, locals),
	]);

	return { vehicle, schedules, classifications };
};

export const actions: Actions = {
	complete: async ({ locals, params, request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const notes = data.get('notes') as string | null;
		const date = data.get('date') as string | null;
		const mileage = data.get('mileage') ? Number(data.get('mileage')) : undefined;

		try {
			await completeServiceSchedule(params.id!, id, { notes, date, mileage }, locals);
			return { success: true };
		} catch {
			return fail(422, { error: 'Failed to complete schedule' });
		}
	},

	delete: async ({ locals, params, request }) => {
		const id = Number((await request.formData()).get('id'));

		try {
			await deleteServiceSchedule(params.id!, id, locals);
			return { success: true };
		} catch {
			return fail(422, { error: 'Failed to delete schedule' });
		}
	},

	suggest: async ({ locals, params, request }) => {
		const data = await request.formData();
		const presetNames = JSON.parse((data.get('preset_names') as string) || '[]') as string[];
		if (!presetNames.length) {
			return { success: true };
		}

		const allPresets = await getPresets({ authToken: locals.authToken });
		const nameLookup = new Set(presetNames.map((n) => n.toLowerCase()));
		const selectedPresets = Object.values(allPresets)
			.flat()
			.filter((preset) => nameLookup.has(preset.name.toLowerCase()));
		const uniquePresets = Object.values(
			selectedPresets.reduce<Record<string, SchedulePreset>>((acc, preset) => {
				const key = preset.name.toLowerCase();
				if (!acc[key] || preset.distanceInterval || preset.monthInterval) {
					acc[key] = preset;
				}
				return acc;
			}, {}),
		);

		const [existing, existingSchedules] = await Promise.all([
			getClassifications(params.id!, locals),
			getServiceSchedules(params.id!, locals),
		]);
		const existingClassificationIds = new Set(existingSchedules.map((s) => s.classificationId));
		const opts = { authToken: locals.authToken, webUrl: locals.webUrl };

		for (const preset of uniquePresets) {
			let classificationId = existing.find(
				(c) => c.name.toLowerCase() === preset.name.toLowerCase(),
			)?.id;

			if (!classificationId) {
				const classification = await createClassification(
					params.id!,
					{ classification: { name: preset.name } },
					opts,
				);
				classificationId = classification.id;
			}

			if (existingClassificationIds.has(classificationId)) {
				continue;
			}

			await createServiceSchedule(
				params.id!,
				{
					serviceSchedule: {
						classificationId,
						distanceInterval: preset.distanceInterval,
						monthInterval: preset.monthInterval,
					},
				},
				opts,
			);
			existingClassificationIds.add(classificationId);
		}

		return { success: true };
	},
};
