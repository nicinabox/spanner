import { fail, redirect } from '@sveltejs/kit';
import { HTTPError } from '$lib/data/client';
import {
	getUnsubscribeContext,
	saveVehiclePreferences,
	unsubscribeAction,
} from '$lib/data/settings';
import { decode, validate } from '$lib/utils/formData';
import { booleanSchema } from '$lib/schemas';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';

const checkbox = v.pipe(
	v.optional(v.string()),
	v.transform((v) => v === 'on'),
);

const preferencesFormSchema = v.object({
	vehicleId: v.pipe(v.string(), v.transform(Number), v.number('Vehicle is required')),
	sendReminderEmails: booleanSchema,
	sendPromptForRecords: booleanSchema,
});

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
		const parsed = await validate(decode(formData), preferencesFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		try {
			await saveVehiclePreferences(token, parsed.data.vehicleId, {
				sendReminderEmails: parsed.data.sendReminderEmails,
				sendPromptForRecords: parsed.data.sendPromptForRecords,
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
