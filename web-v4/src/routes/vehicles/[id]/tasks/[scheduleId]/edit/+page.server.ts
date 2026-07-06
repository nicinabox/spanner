import { getVehicle } from '$lib/data/vehicles';
import { getServiceSchedule, updateServiceSchedule, deleteServiceSchedule } from '$lib/data/serviceSchedules';
import { updateClassification } from '$lib/data/classifications';
import { getHTTPErrors } from '$lib/utils/actions';
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
		const classificationId = formData.get('classificationId')?.toString();
		const distanceInterval = formData.get('distanceInterval')?.toString();
		const monthInterval = formData.get('monthInterval')?.toString();
		const keywords = formData.get('keywords')?.toString();

		try {
			if (classificationId && keywords !== undefined) {
				const kw = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
				await updateClassification(Number(classificationId), { keywords: kw }, locals);
			}

			await updateServiceSchedule(
				params.id!,
				params.scheduleId!,
				{
					classificationId: classificationId ? Number(classificationId) : undefined,
					distanceInterval: distanceInterval ? Number(distanceInterval) : null,
					monthInterval: monthInterval ? Number(monthInterval) : null,
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
