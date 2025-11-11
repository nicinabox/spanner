import { HTTPError } from '$lib/data/client';
import { createVehicle } from '$lib/data/vehicles';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		let result;

		try {
			result = await createVehicle(data as never, locals);
		} catch (error) {
			return fail(
				422,
				error instanceof HTTPError ? error.data : { errors: ['An unexpected error occurred'] }
			);
		}

		redirect(303, `/vehicles/${result.id}`);
	}
} satisfies Actions;
