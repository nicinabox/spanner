import { getVehicle } from '$lib/data/vehicles';
import {
	getServiceSchedule,
	updateServiceSchedule,
	deleteServiceSchedule,
	deferServiceSchedule,
	clearDeferServiceSchedule,
} from '$lib/data/serviceSchedules';
import { updateClassification } from '$lib/data/classifications';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as v from 'valibot';
import type { PageServerLoad } from './$types';

export const serviceScheduleFormSchema = v.object({
	classificationId: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	name: v.optional(v.string(''), ''),
	keywords: v.optional(v.string(''), ''),
	distanceInterval: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	monthInterval: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
});

const deferFormSchema = v.object({
	months: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
	distance: v.nullish(v.pipe(v.string(), v.transform((s) => (s ? Number(s) : null))), null),
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const schedule = await getServiceSchedule(params.id!, params.scheduleId!, locals);

	return { vehicle, schedule };
};

export const actions = {
	update: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, serviceScheduleFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const data = parsed.data;

		if (data.classificationId) {
			const updateData: Record<string, unknown> = {};
			if (data.name) updateData.name = data.name;
			if (data.keywords !== undefined) {
				updateData.keywords = (data.keywords || '')
					.split(',')
					.map((k: string) => k.trim())
					.filter(Boolean);
			}
			if (Object.keys(updateData).length > 0) {
				await updateClassification(
					data.classificationId,
					{ classification: updateData },
					locals,
				);
			}
		}

		await updateServiceSchedule(
			params.id!,
			params.scheduleId!,
			{
				classificationId: data.classificationId || undefined,
				distanceInterval: data.distanceInterval ?? null,
				monthInterval: data.monthInterval ?? null,
			},
			locals,
		);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	delete: withActionErrors(async ({ locals, params }) => {
		await deleteServiceSchedule(params.id!, params.scheduleId!, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	defer: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, deferFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await deferServiceSchedule(
			params.id!,
			params.scheduleId!,
			{
				months: parsed.data.months ?? null,
				distance: parsed.data.distance ?? null,
			},
			locals,
		);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	clear_defer: withActionErrors(async ({ locals, params }) => {
		await clearDeferServiceSchedule(params.id!, params.scheduleId!, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),
} satisfies Actions;
