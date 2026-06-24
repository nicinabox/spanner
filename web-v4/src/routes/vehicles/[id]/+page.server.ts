import { getVehicle, updateVehicle } from '$lib/data/vehicles';
import { getVehicleHistory } from '$lib/data/history';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	const history = await getVehicleHistory(params.id!, locals);

	return { vehicle, history };
};

export const actions = {
	toggleRetire: async ({ locals, params }) => {
		const vehicle = await getVehicle(params.id!, locals);
		await updateVehicle(params.id!, { retired: !vehicle.retired } as never, locals);
	}
} satisfies Actions;
