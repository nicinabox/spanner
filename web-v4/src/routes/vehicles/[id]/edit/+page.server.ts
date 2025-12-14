import { deleteVehicle, updateVehicle } from '$lib/data/vehicles';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData);

		try {
			await updateVehicle(params.id!, data, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		const referrer = request.headers.get('referer');
		redirect(303, referrer || `/vehicles/${params.id}`);
	},
	delete: async ({ locals, params }) => {
		try {
			await deleteVehicle(params.id!, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, '/vehicles');
	}
} satisfies Actions;
