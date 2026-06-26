import { getSharedVehicle, getSharedVehicleHistory } from '$lib/data/share';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [vehicle, history] = await Promise.all([
		getSharedVehicle(params.id),
		getSharedVehicleHistory(params.id),
	]);

	if (!vehicle) {
		error(404, 'Vehicle not found');
	}

	return { vehicle, history };
};
