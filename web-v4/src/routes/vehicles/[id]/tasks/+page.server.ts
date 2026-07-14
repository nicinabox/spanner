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
import { decode, validate, encode } from '$lib/utils/formData';
import { fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PageServerLoad, Actions } from './$types';
import { numberSchema } from '$lib/schemas';
import { withActionErrors } from '$lib/utils/actions';
import { uploadRecord } from '$lib/data/multipart';
import { attachmentsSchema } from '../history/schemas';

const completeFormSchema = v.object({
	id: v.string(),
	date: v.optional(v.string()),
	notes: v.optional(v.string()),
	mileage: v.optional(v.string()),
	cost: v.optional(v.string()),
	attachments: v.optional(attachmentsSchema),
});

const deferFormSchema = v.object({
	id: v.optional(numberSchema),
	months: v.optional(numberSchema),
	distance: v.optional(numberSchema),
});

const idOnlySchema = v.object({
	id: v.optional(numberSchema),
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const [schedules, classifications, reminders, presetGroups] = await Promise.all([
		getServiceSchedules(params.id!, locals),
		getClassifications(params.id!, locals),
		getVehicleReminders(params.id!, locals),
		getPresets({
			authToken: locals.authToken,
			webUrl: locals.webUrl,
			params: { distance_unit: vehicle.distanceUnit },
		}),
	]);

	return { vehicle, schedules, classifications, reminders, presetGroups };
};

export const actions: Actions = {
	complete: async ({ locals, params, request }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), completeFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const body = encode({ record: parsed.data });

		try {
			const result = await uploadRecord(params.id!, undefined, body, locals);
			await completeServiceSchedule(
				params.id!,
				parsed.data.id,
				{ record_id: (result as any).id },
				locals,
			);
			redirect(303, `/vehicles/${params.id}/tasks`);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to complete schedule';
			return fail(422, { errors: [{ id: 'form', title: message }] });
		}
	},

	defer: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), deferFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });
		if (!parsed.data.id)
			return fail(422, { errors: [{ id: 'form', title: 'Missing schedule id' }] });

		await deferServiceSchedule(
			params.id!,
			parsed.data.id,
			{
				months: parsed.data.months,
				distance: parsed.data.distance,
			},
			locals,
		);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	clearDefer: withActionErrors(async ({ locals, params, request }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), idOnlySchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });
		if (!parsed.data.id)
			return fail(422, { errors: [{ id: 'form', title: 'Missing schedule id' }] });

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
					distanceInterval: preset.intervals[distanceUnit],
					monthInterval: preset.intervals['mo'],
				},
				opts,
			);
		}

		return { success: true };
	},
};
