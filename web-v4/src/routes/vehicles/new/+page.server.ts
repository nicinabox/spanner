import { createVehicle } from '$lib/data/vehicles';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import { safeAsync } from '$lib/utils/async';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = decode(formData, {
			name: 'string',
			vin: 'string',
			color: 'string',
			distanceUnit: 'string',
			'preferences.enableCost': 'boolean',
			'preferences.sendReminderEmails': 'boolean',
			'preferences.sendPromptForRecords': 'boolean',
			'preferences.showMileageAdjustmentRecords': 'boolean'
		});

		const [vehicle, error] = await safeAsync(createVehicle({ vehicle: data } as never, locals));
		if (vehicle) redirect(303, `/vehicles/${vehicle.id}`);

		if (error instanceof Error && 'status' in error) {
			return fail(422, getHTTPErrors(error));
		}
	}
} satisfies Actions;
