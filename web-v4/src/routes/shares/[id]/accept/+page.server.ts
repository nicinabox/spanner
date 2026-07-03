import { getPendingShares, acceptShare } from '$lib/data/shares';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const shares = await getPendingShares(locals);
	const share = shares.find((s) => s.id === Number(params.id));

	if (!share) {
		return { status: 'expired' as const };
	}

	return { status: 'pending' as const, share };
};

export const actions = {
	accept: async ({ params, locals }) => {
		await acceptShare(Number(params.id), locals);
		const shares = await getPendingShares(locals);
		const share = shares.find((s) => s.id === Number(params.id));
		throw redirect(303, `/vehicles/${share?.vehicle?.id}`);
	},
};
