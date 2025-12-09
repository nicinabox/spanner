import { updateUser } from '$lib/data/user';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import type { Actions } from '../$types';
import { fail } from '@sveltejs/kit';

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
