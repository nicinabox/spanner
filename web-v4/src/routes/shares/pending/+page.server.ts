import { getPendingShares } from '$lib/data/shares';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const shares = await getPendingShares(locals);
	return { shares };
};
