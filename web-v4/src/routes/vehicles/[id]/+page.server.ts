import { getVehicle } from '$lib/data/vehicles';
import { getVehicleHistory } from '$lib/data/history';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const history = await getVehicleHistory(params.id!, locals);

	return { vehicle, history };
};
