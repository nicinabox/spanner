import { getVehicle } from '$lib/data/vehicles';

export const load = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id, locals);
	return { vehicle };
};
