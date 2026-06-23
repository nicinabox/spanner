import { createVehicle } from '$lib/data/vehicles';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = decode(formData);

		try {
			const vehicle = await createVehicle({ vehicle: data } as never, locals);
			redirect(303, `/vehicles/${vehicle.id}`);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	}
} satisfies Actions;
