import { getVehicle } from '$lib/data/vehicles';
import {
	getServiceSchedules,
	completeServiceSchedule,
	deleteServiceSchedule,
	createServiceSchedule,
	getPresets,
} from '$lib/data/serviceSchedules';
import { getVehicleReminders, deleteReminder } from '$lib/data/reminders';
import { getClassifications, createClassification } from '$lib/data/classifications';
import { uploadRecord, toMultipartFormData } from '$lib/data/multipart';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const [schedules, classifications, reminders, presetGroups] = await Promise.all([
		getServiceSchedules(params.id!, locals),
		getClassifications(params.id!, locals),
		getVehicleReminders(params.id!, locals),
		getPresets({ authToken: locals.authToken, webUrl: locals.webUrl, params: { distance_unit: vehicle.distanceUnit } }),
	]);

	return { vehicle, schedules, classifications, reminders, presetGroups };
};

export const actions: Actions = {
	complete: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const date = formData.get('date')?.toString();
		const notes = formData.get('notes')?.toString();
		const mileage = formData.get('mileage')?.toString();
		const cost = formData.get('cost')?.toString();
		const files = formData.getAll('record[attachments][]') as File[];

		const body = toMultipartFormData(
			{ date, notes, mileage: mileage || null, cost: cost || null },
			{ prefix: 'record' },
		);
		for (const file of files) {
			body.append('record[attachments][]', file);
		}

		try {
			const record = await uploadRecord(params.id!, undefined, body, locals);
			await completeServiceSchedule(params.id!, id, { record_id: (record as any).id }, locals);
			redirect(303, `/vehicles/${params.id}/tasks`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to complete schedule';
			return fail(422, { errors: [{ id: 'form', title: message }] });
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

	delete_reminder: async ({ locals, params, request }) => {
		const id = Number((await request.formData()).get('id'));
		await deleteReminder(params.id!, id, locals);
		return { success: true };
	},

	suggest: async ({ locals, params, request }) => {
		const data = await request.formData();
		const presetData = JSON.parse((data.get('preset_data') as string) || '[]') as Array<{
			name: string;
			intervals: Record<string, number>;
			keywords: string[];
		}>;
		const distanceUnit = (data.get('distance_unit') as string) || 'mi';

		if (!presetData.length) {
			return { success: true };
		}

		const opts = { authToken: locals.authToken, webUrl: locals.webUrl };

		for (const preset of presetData) {
			const classification = await createClassification(
				params.id!,
				{ classification: { name: preset.name, keywords: preset.keywords } },
				opts,
			);
			await createServiceSchedule(
				params.id!,
				{
					serviceSchedule: {
						classificationId: classification.id,
						distanceInterval: preset.intervals[distanceUnit] ?? null,
						monthInterval: preset.intervals['mo'] ?? null,
					},
				},
				opts,
			);
		}

		return { success: true };
	},
};
