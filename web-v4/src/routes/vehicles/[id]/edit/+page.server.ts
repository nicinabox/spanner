import { deleteVehicle, getVehicle, updateVehicle } from '$lib/data/vehicles';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { vehicleFormSchema } from '../../schemas';
import * as v from 'valibot';
import type { PageServerLoad } from './$types';
import { vehiclePath } from '$lib/routes';
import { booleanSchema } from '$lib/schemas';

const editVehicleFormSchema = v.object({
	...vehicleFormSchema.entries,
	retired: booleanSchema,
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const vehicle = await getVehicle(params.id!, locals);
	return { vehicle };
};

export const actions = {
	update: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, editVehicleFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await updateVehicle(params.id!, parsed.data, locals);
		redirect(303, vehiclePath(Number(params.id)));
	}),
	delete: withActionErrors(async ({ locals, params }) => {
		await deleteVehicle(params.id!, locals);
		redirect(303, '/vehicles');
	}),
} satisfies Actions;
