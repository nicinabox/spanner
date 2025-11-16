import { createVehicle } from '$lib/data/vehicles';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = decode(formData);

		let result;

		try {
			result = await createVehicle(data as never, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${result.id}`);
	}
} satisfies Actions;
