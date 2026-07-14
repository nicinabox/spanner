import { getVehicle } from '$lib/data/vehicles';
import { createHistoryEntry } from '$lib/data/history';
import { uploadRecord } from '$lib/data/multipart';
import { createVehicleReminder, deleteReminder } from '$lib/data/reminders';
import { getClassifications } from '$lib/data/classifications';
import { createServiceSchedule, type ServiceScheduleCreateData } from '$lib/data/serviceSchedules';
import { withActionErrors } from '$lib/utils/actions';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { reminderFormSchema } from '../reminders/schemas';
import { recordFormSchema } from '../history/schemas';
import * as v from 'valibot';
import type { PageServerLoad } from './$types';
import { numberSchema } from '$lib/schemas';
import { decode, encode, validate } from '$lib/utils/formData';

const mileageAdjustmentSchema = v.object({
	mileage: v.optional(numberSchema),
});

const scheduleFormSchema = v.object({
	classificationId: v.optional(numberSchema),
	name: v.optional(v.string(''), ''),
	keywords: v.optional(v.string(''), ''),
	distanceInterval: v.optional(numberSchema),
	monthInterval: v.optional(numberSchema),
	notes: v.optional(v.string(''), ''),
});

export const load: PageServerLoad = async ({ locals, params }) => {
	const [vehicle, classifications] = await Promise.all([
		getVehicle(params.id!, locals),
		getClassifications(params.id!, locals),
	]);

	if (vehicle.retired) {
		redirect(303, `/vehicles/${params.id}`);
	}

	return { vehicle, classifications };
};

export const actions = {
	record: withActionErrors(async ({ request, locals, params, url }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), recordFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const body = encode({ record: parsed.data });

		await uploadRecord(params.id!, undefined, body, locals);

		// When a record is created from a reminder, delete that reminder for housekeeping
		const reminderId = url.searchParams.get('reminder_id');
		if (reminderId) {
			await deleteReminder(params.id!, reminderId, locals);
		}

		redirect(303, `/vehicles/${params.id}`);
	}),

	reminder: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), reminderFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		await createVehicleReminder(params.id!, parsed.data, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),

	mileageAdjustment: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), mileageAdjustmentSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });
		if (typeof parsed.data.mileage !== 'number') {
			return fail(400, { errors: [{ id: 'mileage', title: 'Mileage is required' }] });
		}

		await createHistoryEntry(
			params.id!,
			{
				date: new Date().toISOString().split('T')[0],
				notes: 'Mileage adjustment',
				mileage: parsed.data.mileage,
				recordType: 'mileage adjustment',
			},
			locals,
		);
		redirect(303, `/vehicles/${params.id}`);
	}),

	schedule: withActionErrors(async ({ request, locals, params }) => {
		const formData = await request.formData();
		const parsed = await validate(decode(formData), scheduleFormSchema);
		if (parsed.errors) return fail(422, { errors: parsed.errors });

		const { classificationId, name } = parsed.data;

		if (!classificationId && !name) {
			return fail(400, {
				errors: [{ id: 'classificationId', title: 'Select or create a service' }],
			});
		}

		if (!parsed.data.distanceInterval && !parsed.data.monthInterval) {
			return fail(400, {
				errors: [{ id: 'form', title: 'Set a distance or month interval' }],
			});
		}

		const serviceSchedule: ServiceScheduleCreateData = {
			distanceInterval: parsed.data.distanceInterval,
			monthInterval: parsed.data.monthInterval,
			notes: parsed.data.notes,
		};

		if (name) {
			const keywords = (parsed.data.keywords || '')
				.split(',')
				.map((k: string) => k.trim())
				.filter(Boolean);
			serviceSchedule.classificationName = name;
			serviceSchedule.keywords = keywords;
		} else {
			serviceSchedule.classificationId = classificationId ?? undefined;
		}

		await createServiceSchedule(params.id!, serviceSchedule, locals);
		redirect(303, `/vehicles/${params.id}/tasks`);
	}),
} satisfies Actions;
