import { updateVehicle } from '$lib/data/vehicles';
import { safeAsync } from '$lib/utils/async';
import { validate } from '$lib/utils/form';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();

		const { valid, errors, data } = validate(formData, {
			name: {
				required: true
			}
		});

		if (!valid) {
			return fail(422, { errors });
		}

		const [result, error] = await safeAsync(updateVehicle(params.id!, data, locals));

		if (result) {
			redirect(303, `/vehicles/${params.id}`);
		}

		return fail(422, { error });
	}
} satisfies Actions;
