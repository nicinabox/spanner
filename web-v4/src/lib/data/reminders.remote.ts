import { query } from '$app/server';
import { getRequestEvent } from '$app/server';
import { getAuthToken } from '$lib/utils/session';
import { request } from './server';
import * as v from 'valibot';

export const estimateReminderDate = query(
	v.object({
		vehicleId: v.pipe(v.string(), v.nonEmpty()),
		mileage: v.pipe(v.number(), v.minValue(0)),
		date: v.pipe(v.string(), v.nonEmpty()),
		reminderType: v.pipe(v.string(), v.nonEmpty()),
	}),
	async ({ vehicleId, mileage, date, reminderType }) => {
		const event = getRequestEvent();
		const token = await getAuthToken(event.cookies);

		return request<{ reminderDate: string }>(
			`/vehicles/${vehicleId}/reminders/estimate_date`,
			{
				authToken: token,
				params: {
					'reminder[mileage]': mileage,
					'reminder[date]': date,
					'reminder[reminder_type]': reminderType,
				},
			},
		);
	},
);
