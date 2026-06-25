import { getCurrentUser } from '$lib/data/user';
import { getAllVehicles } from '$lib/data/vehicles';
import { updateUser } from '$lib/data/user';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [vehicles, user] = await Promise.all([getAllVehicles(locals), getCurrentUser(locals)]);

	return { vehicles, user, session: locals.session };
};

export const actions = {
	updateUserPreferences: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = decode(formData);

		try {
			const user = await updateUser(
				{
					preferences: {
						vehiclesSortOrder: [data.strategy, data.order]
					}
				},
				locals
			);
			return { user };
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}
	}
} satisfies Actions;