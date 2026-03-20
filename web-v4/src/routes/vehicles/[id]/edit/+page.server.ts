import { deleteVehicle, updateVehicle } from '$lib/data/vehicles';
import { getHTTPErrors } from '$lib/utils/actions';
import { decode } from '$lib/utils/form';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const data = decode(formData, {
			name: 'string',
			vin: 'string',
			distanceUnit: 'string',
			retired: 'boolean',
			'preferences.enableCost': 'boolean',
			'preferences.sendReminderEmails': 'boolean',
			'preferences.sendPromptForRecords': 'boolean',
			'preferences.showMileageAdjustmentRecords': 'boolean'
		});

		try {
			await updateVehicle(params.id!, { vehicle: data } as never, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, `/vehicles/${params.id}`);
	},
	delete: async ({ locals, params }) => {
		try {
			await deleteVehicle(params.id!, locals);
		} catch (error) {
			return fail(422, getHTTPErrors(error));
		}

		redirect(303, '/vehicles');
	}
} satisfies Actions;
