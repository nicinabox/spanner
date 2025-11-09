import { getVehicleHistory } from '$lib/data/history';
import { getVehicle } from '$lib/data/vehicles';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const [vehicle, history] = await Promise.all([
		getVehicle(params.id, locals),
		getVehicleHistory(params.id, locals)
	]);

	return { vehicle, history };
};
