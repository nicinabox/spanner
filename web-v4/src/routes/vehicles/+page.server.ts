import { getAllVehicles } from '$lib/data/vehicles';

export const load = async ({ locals }) => {
	const vehicles = await getAllVehicles(locals);
	return { vehicles };
};
