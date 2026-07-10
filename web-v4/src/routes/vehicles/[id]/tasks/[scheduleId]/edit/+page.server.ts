import { getVehicle } from '$lib/data/vehicles';
import { getServiceSchedule, updateServiceSchedule, deleteServiceSchedule } from '$lib/data/serviceSchedules';
import { updateClassification } from '$lib/data/classifications';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const schedule = await getServiceSchedule(params.id!, params.scheduleId!, locals);

	return { vehicle, schedule };
};

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData, {
			classificationId: 'number',
			name: 'string',
			keywords: 'string',
			distanceInterval: 'number',
			monthInterval: 'number',
		});

		try {
			if (data.classificationId) {
				const updateData: Record<string, unknown> = {};
				if (data.name) {
					updateData.name = data.name;
				}
				if (data.keywords !== undefined) {
					updateData.keywords = (data.keywords || '')
						.split(',')
						.map((k: string) => k.trim())
						.filter(Boolean);
				}
				if (Object.keys(updateData).length > 0) {
					await updateClassification(data.classificationId, { classification: updateData }, locals);
				}
			}

			await updateServiceSchedule(
				params.id!,
				params.scheduleId!,
				{
					classificationId: data.classificationId || undefined,
					distanceInterval: data.distanceInterval || null,
					monthInterval: data.monthInterval || null,
				},
				locals,
			);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}/tasks`);
	},

	delete: async ({ locals, params }) => {
		await deleteServiceSchedule(params.id!, params.scheduleId!, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	},
} satisfies Actions;
