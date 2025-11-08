import { getVehicleHistory } from '$lib/data/history';
import { getVehicle } from '$lib/data/vehicles';

export const load = async ({ locals, params }) => {
	const [vehicle, history] = await Promise.all([
		getVehicle(params.id, locals),
		getVehicleHistory(params.id, locals)
	]);

	return { vehicle, history };
};
