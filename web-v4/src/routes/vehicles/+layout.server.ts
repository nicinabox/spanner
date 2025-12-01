import { getCurrentUser } from '$lib/data/user';
import { getAllVehicles } from '$lib/data/vehicles';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const [vehicles, user] = await Promise.all([getAllVehicles(locals), getCurrentUser(locals)]);

	return { vehicles, user, session: locals.session };
};
