import { getVehicle } from '$lib/data/vehicles';
import {
	getServiceSchedules,
	completeServiceSchedule,
	createServiceSchedule,
	deferServiceSchedule,
	clearDeferServiceSchedule,
	getPresets,
} from '$lib/data/serviceSchedules';
import { getVehicleReminders } from '$lib/data/reminders';
import { getClassifications } from '$lib/data/classifications';
import { uploadRecord, toMultipartFormData } from '$lib/data/multipart';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PageServerLoad, Actions } from './$types';

const deferFormSchema = v.object({
	id: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	months: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	distance: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
});

const idOnlySchema = v.object({
	id: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
});

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

	defer: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, deferFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });
		if (!parsed.data.id) return fail(422, { errors: [{ id: 'form', title: 'Missing schedule id' }] });

		await deferServiceSchedule(
			params.id!,
			parsed.data.id,
			{
				months: parsed.data.months ?? null,
				distance: parsed.data.distance ?? null,
			},
			locals,
		);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	clearDefer: withActionErrors(async ({ locals, params, request }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, idOnlySchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });
		if (!parsed.data.id) return fail(422, { errors: [{ id: 'form', title: 'Missing schedule id' }] });

		await clearDeferServiceSchedule(params.id!, parsed.data.id, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

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
			await createServiceSchedule(
				params.id!,
				{
					classificationName: preset.name,
					keywords: preset.keywords,
					distanceInterval: preset.intervals[distanceUnit] ?? null,
					monthInterval: preset.intervals['mo'] ?? null,
				},
				opts,
			);
		}

		return { success: true };
	},
};
