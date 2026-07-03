import { getVehicle } from '$lib/data/vehicles';
import { getServiceSchedules, completeServiceSchedule, deleteServiceSchedule, createServiceSchedule } from '$lib/data/serviceSchedules';
import { getClassifications } from '$lib/data/classifications';
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

	create: async ({ locals, params, request }) => {
		const data = await request.formData();
		const body: Record<string, unknown> = {
			service_schedule: {
				classification_id: Number(data.get('classification_id')),
				distance_interval: data.get('distance_interval') ? Number(data.get('distance_interval')) : null,
				month_interval: data.get('month_interval') ? Number(data.get('month_interval')) : null,
				notes: data.get('notes') || null,
			},
		};

		try {
			await createServiceSchedule(params.id!, body, locals);
			return { success: true };
		} catch {
			return fail(422, { error: 'Failed to create schedule' });
		}
	},
};
