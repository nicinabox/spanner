import { createVehicle } from '$lib/data/vehicles';
import { withActionErrors } from '$lib/utils/actions';
import { decode, validate } from '$lib/utils/formData';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { vehicleFormSchema } from '../schemas';

export const actions = {
	createVehicle: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), vehicleFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const vehicle = await createVehicle(parsed.data, locals);
		redirect(303, `/vehicles/${vehicle.id}`);
	}),
} satisfies Actions;
