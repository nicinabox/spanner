import { getCurrentUser } from '$lib/data/user';
import { getAllVehicles, type Sortable, type VehicleSortStrategy, type Order } from '$lib/data/vehicles';
import { updateUser } from '$lib/data/user';
import { withActionErrors } from '$lib/utils/actions';
import { decode, validate } from '$lib/utils/formData';
import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';

const userPreferencesSchema = v.object({
	strategy: v.optional(v.string(''), ''),
	order: v.optional(v.string(''), ''),
});

export const load: PageServerLoad = async ({ locals }) => {
	const [vehicles, user] = await Promise.all([getAllVehicles(locals), getCurrentUser(locals)]);

	return { vehicles, user, session: locals.session };
};

export const actions = {
	updateUserPreferences: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), userPreferencesSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const user = await updateUser(
			{
				preferences: {
					vehiclesSortOrder: [parsed.data.strategy, parsed.data.order] as Sortable,
				},
			},
			locals,
		);
		return { user };
	}),
} satisfies Actions;
