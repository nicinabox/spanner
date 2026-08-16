import { getVehicle } from '$lib/data/vehicles';
import {
	getServiceSchedules,
	completeServiceSchedule,
	createServiceSchedules,
	deferServiceSchedule,
	clearDeferServiceSchedule,
	getServiceSchedulePresets,
} from '$lib/data/serviceSchedules';
import { getVehicleReminders } from '$lib/data/reminders';
import { getClassifications } from '$lib/data/classifications';
import { decode, validate, encode } from '$lib/utils/formData';
import { fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PageServerLoad, Actions } from './$types';
import { numberSchema } from '$lib/schemas';
import { withActionErrors } from '$lib/utils/actions';
import { attachmentsSchema } from '../history/schemas';
import { createHistoryEntry } from '$lib/data/history';

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

const suggestSchema = v.object({
	distanceUnit: v.string(),
	presetData: v.pipe(
		v.string(),
		v.transform((input) => JSON.parse(input)),
		v.array(
			v.object({
				name: v.string(),
				intervals: v.record(v.string(), v.number()),
				keywords: v.array(v.string()),
			}),
		),
	),
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
		getServiceSchedulePresets({
			authToken: locals.authToken,
			webUrl: locals.webUrl,
			params: { distance_unit: vehicle.distanceUnit },
		}),
	]);

	return { vehicle, schedules, classifications, reminders, presetGroups };
};

export const actions = {
	complete: withActionErrors(async ({ locals, params, request }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), completeFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const body = encode({ record: parsed.data });

		const result = await createHistoryEntry(params.id!, body, locals);
		await completeServiceSchedule(params.id!, parsed.data.id, { record_id: result.id }, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

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

	suggest: withActionErrors(async ({ locals, params, request }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), suggestSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const schedules = parsed.data.presetData.map((preset) => ({
			classificationName: preset.name,
			keywords: preset.keywords,
			distanceInterval: preset.intervals[parsed.data.distanceUnit],
			monthInterval: preset.intervals['mo'],
		}));

		await createServiceSchedules(params.id!, schedules, locals);

		return { success: true };
	}),
} satisfies Actions;
