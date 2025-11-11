import { HTTPError } from '$lib/data/client';
import { updateVehicle } from '$lib/data/vehicles';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		try {
			await updateVehicle(params.id!, data, locals);
			redirect(303, `/vehicles/${params.id}`);
		} catch (error) {
			return fail(
				422,
				error instanceof HTTPError ? error.data : { errors: ['An unexpected error occurred'] }
			);
		}
	}
} satisfies Actions;
