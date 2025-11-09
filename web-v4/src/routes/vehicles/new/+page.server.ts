import type { CreatableFields } from '$lib/data/client';
import { createVehicle, type Vehicle } from '$lib/data/vehicles';
import { safeAsync } from '$lib/utils/async';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData.entries());

		const [result, error] = await safeAsync(createVehicle(data, locals));

		if (result) {
			redirect(303, `/vehicles/${result.id}`);
		}

		return { success: false, error };
	}
} satisfies Actions;
