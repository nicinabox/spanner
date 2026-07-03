import { getVehicle } from '$lib/data/vehicles';
import {
	getServiceSchedules,
	completeServiceSchedule,
	deleteServiceSchedule,
	createServiceSchedule,
} from '$lib/data/serviceSchedules';
import { getClassifications, createClassification } from '$lib/data/classifications';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

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
		const presetNames: string[] = JSON.parse((data.get('preset_names') as string) || '[]');

		const res = await fetch(`${locals.webUrl}/api/service_schedules/presets`, {
			headers: { authorization: `Token ${locals.authToken}` },
		});
		const allPresets: Record<
			string,
			{ name: string; distance_interval: number | null; month_interval: number | null }[]
		> = await res.json();

		const toCreate: {
			name: string;
			distance_interval: number | null;
			month_interval: number | null;
		}[] = [];
		for (const group of Object.values(allPresets)) {
			for (const preset of group) {
				if (presetNames.includes(preset.name)) {
					toCreate.push(preset);
				}
			}
		}

		const existing = await getClassifications(params.id!, locals);

		for (const preset of toCreate) {
			let classificationId = existing.find(
				(c) => c.name.toLowerCase() === preset.name.toLowerCase(),
			)?.id;

			if (!classificationId) {
				const classification = await createClassification(
					params.id!,
					{ classification: { name: preset.name } },
					locals,
				);
				classificationId = classification.id;
			}

			await createServiceSchedule(
				params.id!,
				{
					service_schedule: {
						classification_id: classificationId,
						distance_interval: preset.distance_interval,
						month_interval: preset.month_interval,
					},
				},
				locals,
			);
		}

		return { success: true };
	},
};
