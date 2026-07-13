import { getVehicle, updateVehicle } from '$lib/data/vehicles';
import { getVehicleHistory } from '$lib/data/history';
import { getVehicleReminders } from '$lib/data/reminders';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const [vehicle, history, reminders] = await Promise.all([
		getVehicle(params.id!, locals),
		getVehicleHistory(params.id!, locals),
		getVehicleReminders(params.id!, locals),
	]);

	return { vehicle, history, reminders };
};

export const actions = {
	toggleRetire: async ({ locals, params }) => {
		const vehicle = await getVehicle(params.id!, locals);
		await updateVehicle(params.id!, { retired: !vehicle.retired } as never, locals);
	},
	toggleShare: async ({ locals, params }) => {
		const vehicle = await getVehicle(params.id!, locals);
		await updateVehicle(
			params.id!,
			{
				preferences: { ...vehicle.preferences, enableSharing: !vehicle.preferences.enableSharing },
			} as never,
			locals,
		);
	},
} satisfies Actions;
