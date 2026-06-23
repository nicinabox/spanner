import { getVehicle } from '$lib/data/vehicles';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);

	return { vehicle };
};
