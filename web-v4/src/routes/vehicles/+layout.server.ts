import { getAllVehicles } from '$lib/data/vehicles';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const vehicles = await getAllVehicles(locals);
	return { vehicles, session: locals.session };
};
