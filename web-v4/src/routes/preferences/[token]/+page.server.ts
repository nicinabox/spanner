import { fail, redirect } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';
import {
	getUnsubscribeContext,
	saveVehiclePreferences,
	unsubscribeAction,
} from '$lib/data/settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const token = params.token;
	const vehicleIdParam = url.searchParams.get('vehicle_id');
	const vehicleId = vehicleIdParam ? Number(vehicleIdParam) : undefined;

	if (!token) {
		return { error: 'No token provided.' };
	}

	try {
		const context = await getUnsubscribeContext(token, vehicleId);
		return context;
	} catch (err) {
		return { error: 'Invalid or expired link.' };
	}
};

export const actions = {
	update: async ({ params, request }) => {
		const token = params.token!;
		const formData = await request.formData();
		const vehicleId = Number(formData.get('vehicle_id'));

		if (!vehicleId) {
			return fail(422, { error: 'Vehicle is required.' });
		}

		const sendReminderEmails = formData.get('send_reminder_emails') === 'on';
		const sendPromptForRecords = formData.get('send_prompt_for_records') === 'on';

		try {
			await saveVehiclePreferences(token, vehicleId, {
				sendReminderEmails,
				sendPromptForRecords,
			});
			return { success: true };
		} catch {
			return fail(422, { error: "Couldn't save preferences. Please try again." });
		}
	},

	unsubscribe: async ({ params, request }) => {
		const token = params.token!;
		const formData = await request.formData();
		const vehicleIdRaw = formData.get('vehicle_id');
		const vehicleId =
			typeof vehicleIdRaw === 'string' && vehicleIdRaw !== '' ? Number(vehicleIdRaw) : null;
		try {
			await unsubscribeAction(token, 'unsubscribe');
		} catch {
			return fail(422, { error: "Couldn't unsubscribe. Please try again." });
		}
		throw redirect(
			303,
			vehicleId ? `/preferences/${token}?vehicle_id=${vehicleId}` : `/preferences/${token}`,
		);
	},

	reactivate: async ({ params, request }) => {
		const token = params.token!;
		const formData = await request.formData();
		const vehicleIdRaw = formData.get('vehicle_id');
		const vehicleId =
			typeof vehicleIdRaw === 'string' && vehicleIdRaw !== '' ? Number(vehicleIdRaw) : null;
		try {
			await unsubscribeAction(token, 'reactivate');
		} catch {
			return fail(422, { error: "Couldn't reactivate. Please try again." });
		}
		throw redirect(
			303,
			vehicleId ? `/preferences/${token}?vehicle_id=${vehicleId}` : `/preferences/${token}`,
		);
	},
} satisfies Actions;
