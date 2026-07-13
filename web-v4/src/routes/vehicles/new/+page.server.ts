import { createVehicle } from '$lib/data/vehicles';
import { withActionErrors } from '$lib/utils/actions';
import { parseForm } from '$lib/utils/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as v from 'valibot';

const distanceUnitSchema = v.optional(v.picklist(['mi', 'km', 'nmi']), 'mi');
const booleanPreference = v.optional(v.boolean(), false);

export const vehicleFormSchema = v.object({
	name: v.pipe(v.string('Name is required'), v.minLength(1, 'Name is required')),
	vin: v.optional(v.string(''), ''),
	color: v.optional(v.string(''), ''),
	distanceUnit: distanceUnitSchema,
	'preferences.enableCost': booleanPreference,
	'preferences.sendReminderEmails': booleanPreference,
	'preferences.sendPromptForRecords': booleanPreference,
	'preferences.showMileageAdjustmentRecords': booleanPreference,
});

export const actions = {
	default: withActionErrors(async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = parseForm(formData, vehicleFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const vehicle = await createVehicle({ vehicle: parsed.data } as never, locals);
		redirect(303, `/vehicles/${vehicle.id}`);
	}),
} satisfies Actions;
