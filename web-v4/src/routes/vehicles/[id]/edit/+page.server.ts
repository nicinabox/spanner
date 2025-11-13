import { HTTPError } from '$lib/data/client';
import { deleteVehicle, updateVehicle } from '$lib/data/vehicles';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			await updateVehicle(params.id!, data, locals);
		} catch (error) {
			return fail(
				422,
				error instanceof HTTPError ? error.data : { errors: ['An unexpected error occurred'] }
			);
		}

		redirect(303, `/vehicles/${params.id}`);
	},
	delete: async ({ locals, params }) => {
		try {
			await deleteVehicle(params.id!, locals);
		} catch (error) {
			return fail(
				422,
				error instanceof HTTPError ? error.data : { errors: ['An unexpected error occurred'] }
			);
		}

		redirect(303, '/vehicles');
	}
} satisfies Actions;
