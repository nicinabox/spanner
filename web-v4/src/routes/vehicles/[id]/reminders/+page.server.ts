import { getVehicle } from '$lib/data/vehicles';
import { getVehicleReminders } from '$lib/data/reminders';
import { getClassifications } from '$lib/data/classifications';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const [vehicle, reminders, classifications] = await Promise.all([
		getVehicle(params.id!, locals),
		getVehicleReminders(params.id!, locals),
		getClassifications(params.id!, locals),
	]);

	return { vehicle, reminders, classifications };
};
