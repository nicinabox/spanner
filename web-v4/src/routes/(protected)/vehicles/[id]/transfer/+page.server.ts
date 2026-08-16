import { getVehicle } from '$lib/data/vehicles';
import { withActionErrors } from '$lib/utils/actions';
import { request } from '$lib/data/server';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions: Actions = {
	export: withActionErrors(async ({ locals, params }) => {
		const csv = await request<string>(`/vehicles/${params.id!}/export`, locals);
		return { csv };
	}),
};
