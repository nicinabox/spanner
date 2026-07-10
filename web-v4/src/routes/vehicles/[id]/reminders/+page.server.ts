import { getVehicle } from '$lib/data/vehicles';
import { getVehicleReminders } from '$lib/data/reminders';
import { getClassifications } from '$lib/data/classifications';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const reminders = await getVehicleReminders(params.id!, locals);
	const classifications = await getClassifications(params.id!, locals);

	return { vehicle, reminders, classifications };
};
