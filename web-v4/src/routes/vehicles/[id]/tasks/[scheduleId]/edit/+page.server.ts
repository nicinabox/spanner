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
import { serviceScheduleFormSchema, scheduleDeferFormSchema } from '../../schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const [vehicle, schedule] = await Promise.all([
		getVehicle(params.id!, locals),
		getServiceSchedule(params.id!, params.scheduleId!, locals),
	]);

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
					updateData,
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
		const parsed = parseForm(formData, scheduleDeferFormSchema);
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

	clearDefer: withActionErrors(async ({ locals, params }) => {
		await clearDeferServiceSchedule(params.id!, params.scheduleId!, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),
} satisfies Actions;
